import { BehaviorSubject } from 'rxjs';
import * as storage from './storage';

export default class ShopifyCart {
    constructor(shopifyClient) {
        this.checkoutResource = shopifyClient;
        this.subject = new BehaviorSubject(storage.get());
        this.observable = this.subject.asObservable();
    }

    addToCart(productVariantId) {
        return new Promise((resolve, reject) => {
            let cartStorage = storage.get();

            if (cartStorage.checkoutId) {
                if (!this.checkoutResource) {
                    console.log('error', 'shopifyClient is not found');
                    return;
                }

                this.fetchCheckout(cartStorage.checkoutId).then((cart) => {
                    if (cart['order'] || !cartStorage.variants) {
                        cartStorage = {
                            checkoutId: '',
                            variants: [{
                                variantId: productVariantId,
                                quantity: 1
                            }]
                        };
                    } else {
                        const existed = cartStorage.variants.some(item => item.variantId == productVariantId);

                        if (existed) {
                            reject('item is existed');
                            return;
                        }

                        cartStorage.variants.push({
                            variantId: productVariantId,
                            quantity: 1
                        });
                    }

                    storage.save(cartStorage);
                    const item = storage.get();
                    this.subject.next(item);
                    resolve(item);
                });
            } else {
                if (cartStorage.variants) {
                    const existed = cartStorage.variants.some(item => item.variantId == productVariantId);

                    if (existed) {
                        reject('item is existed');
                        return;
                    }

                    cartStorage.variants.push({
                        variantId: productVariantId,
                        quantity: 1
                    });
                } else {
                    cartStorage.variants = [{
                        variantId: productVariantId,
                        quantity: 1
                    }]
                }

                storage.save(cartStorage);
                const item = storage.get();
                this.subject.next(item);
                resolve(item);
            }
        });
    }

    getCheckout() {
        return new Promise((resolve, reject) => {
            if (!this.checkoutResource) {
                return;
            }

            const cartStorage = storage.get();

            if (!cartStorage.variants || cartStorage.variants.length === 0) {
                reject('There is no item in cart');
                return;
            }

            if (cartStorage.checkoutId) {
                this.fetchCheckout(cartStorage.checkoutId).then((checkout) => {
                    if (checkout['order']) {
                        storage.remove();
                        this.subject.next({});
                        reject('The order has been created successful');
                    } else {
                        resolve(checkout);
                    }
                });
            } else {
                this.createEmptyCheckout().then((result) => {
                    cartStorage.checkoutId = result.data.checkoutCreate.checkout.id;
                    storage.save(cartStorage);

                    this.checkoutAddLineItems(cartStorage.checkoutId, cartStorage.variants).then(checkout => {
                        resolve(checkout);
                    })
                });
            }
        });
    }

    completeCheckout() {
        const cartStorage = storage.get();

        return new Promise((resolve, reject) => {
            if (!cartStorage.checkoutId || !this.checkoutResource) {
                return;
            }

            this.fetchCheckout(cartStorage.checkoutId).then(async (shopifyCheckout) => {
                if (shopifyCheckout['order']) {
                    storage.remove();
                    this.subject.next({});
                    reject('The order has been created successful');
                } else {
                    this.checkoutReplaceLineItems(cartStorage.checkoutId, cartStorage.variants).then((checkout) => {
                        resolve(checkout);
                    });
                }
            });
        });
    }

    fetchCheckout(checkoutId) {
        return this.checkoutResource.fetch(checkoutId);
    }

    createEmptyCheckout() {
        const input = this.checkoutResource.graphQLClient.variable('input', 'CheckoutCreateInput!');
        const mutation = this.checkoutResource.graphQLClient.mutation('CreateEmptyCheckout', [input], (root) => {
            root.add('checkoutCreate', {args: {input}}, (checkoutCreatePayload) => {
                checkoutCreatePayload.add('checkout', (checkout) => {
                    checkout.add('id');
                });
            });
        });

        return this.checkoutResource.graphQLClient.send(mutation, {input: {}});
    }

    checkoutAddLineItems(id, lineItems) {
        return this.checkoutResource.addLineItems(id, lineItems);
    }

    checkoutReplaceLineItems(id, lineItems) {
        return this.checkoutResource.replaceLineItems(id, lineItems);
    }
}
