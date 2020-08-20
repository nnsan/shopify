import * as es6Promise from 'es6-promise';
es6Promise.polyfill();

import 'isomorphic-fetch';
import Client from 'shopify-buy/index.unoptimized.umd';

const client = new Client.buildClient({
    domain: 'nashtechglobal.myshopify.com',
    storefrontAccessToken: 'a2a3c61e2279ee3c67388d8a822b42b1',
    apiVersion: '2020-07'
}, fetch);

export function getProducts() {
    const after = client.graphQLClient.variable('after', 'String');
    const productSelectionSetBuilder = (product) => {
        product.add('title');
        product.add('tags');
        product.add('variants', {args: {first: 10}}, (variant) => {
            variant.add('edges');
        });
    };

    const productsQuery = client.graphQLClient.query('GetAllProducts', [], (root) => {
        root.addConnection('products', {args: {first: 10}}, (product) => {
            productSelectionSetBuilder(product);
        });
    });
    const nextProductsQuery = client.graphQLClient.query('GetAllProducts', [after], (root) => {
        root.addConnection('products', {args: {first: 10, after}}, (product) => {
            productSelectionSetBuilder(product);
        });
    });

    const products = [];

    return new Promise((resolve) => {
        function fetchData(products, cursor) {
            let promise = null;

            if (cursor) {
                promise = client.graphQLClient.send(nextProductsQuery, {after: cursor});
            } else {
                promise = client.graphQLClient.send(productsQuery);
            }

            promise.then((result) => {
                const productModel = result.data.products || {};
                products = products.concat(productModel.edges);

                if (productModel.pageInfo.hasNextPage) {
                    fetchData(products, products[products.length-1].cursor);
                } else {
                    resolve(products);
                }
            });
        }

        fetchData(products);
    })
}
