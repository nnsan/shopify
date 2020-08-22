import * as es6Promise from 'es6-promise';
es6Promise.polyfill();

import 'isomorphic-fetch';
import Client from 'shopify-buy/index.unoptimized.umd';
import ShopifyCart from "./cart";

export default class ShopifyClient {
    constructor(config) {
        this.client = new Client.buildClient({
            domain: config.url,
            storefrontAccessToken: config.token,
            apiVersion: config.apiVerison || '2020-07'
        }, fetch);

        this.cart = new ShopifyCart(this);

        this.productSelectionSetBuilder = (product) => {
            product.add('handle');
            product.add('id');
            product.add('title');
            product.add('priceRange', (range) => {
                range.add('maxVariantPrice', (money) => {
                    money.add('amount');
                });
                range.add('minVariantPrice', (money) => {
                    money.add('amount');
                });
            });
            product.addConnection('variants', {args: {first: 100}}, (variant) => {
                variant.add('id');
                variant.add('sku');
                variant.add('price');
                variant.add('quantityAvailable');
            });
        };
    }

    getProducts(pageSize) {
        return this.fetchQueryRootData('products', {
            first: pageSize || 12
        }, this.productSelectionSetBuilder);
    }

    searchProductByTitle(titleItems, pageSize) {
        const titleSearch = titleItems.map(item => 'title:' + JSON.stringify(item)).join(' OR ');

        return this.fetchQueryRootData('products', {
            first: pageSize || 12,
            query: titleSearch
        }, this.productSelectionSetBuilder);
    }

    getCheckout(checkoutId) {
        return this.client.checkout.fetch(checkoutId);
    }

    createEmptyCheckout() {
        const input = this.client.graphQLClient.variable('input', 'CheckoutCreateInput!');
        const mutation = this.client.graphQLClient.mutation('CreateEmptyCheckout', [input], (root) => {
            root.add('checkoutCreate', {args: {input}}, (checkoutCreatePayload) => {
                checkoutCreatePayload.add('checkout', (checkout) => {
                    checkout.add('id');
                });
            });
        });

        return this.client.graphQLClient.send(mutation, {input: {}});
    }

    checkoutAddLineItems(id, lineItems) {
        return this.client.checkout.addLineItems(id, lineItems);
    }

    checkoutReplaceLineItems(id, lineItems) {
        return this.client.checkout.replaceLineItems(id, lineItems);
    }

    fetchQueryRootData(connectionName, variables, selectionBuilder, operatorName) {
        let acc = [];
        const client = this.client;
        const after = client.graphQLClient.variable('after', 'String');

        return new Promise((resolve) => {
            function fetchData(products, cursor) {
                let promise = null;

                if (cursor) {
                    const nextQuery = client.graphQLClient.query(operatorName, [after],  (root) => {
                        variables['after'] = after;
                        root.addConnection(connectionName, {args: variables}, (model) => {
                            selectionBuilder(model);
                        });
                    });
                    promise = client.graphQLClient.send(nextQuery, {after: cursor});
                } else {
                    const query = client.graphQLClient.query(operatorName, (root) => {
                        root.addConnection(connectionName, {args: variables}, (model) => {
                            selectionBuilder(model);
                        });
                    });
                    promise = client.graphQLClient.send(query, variables);
                }

                promise.then((result) => {
                    const model = result.data[connectionName] || {};
                    acc = acc.concat(model.edges);

                    if (model.pageInfo.hasNextPage) {
                        fetchData(acc, acc[acc.length-1].cursor);
                    } else {
                        resolve(acc);
                    }
                });
            }

            fetchData(acc);
        })
    }
}
