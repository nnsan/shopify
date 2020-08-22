import { BehaviorSubject } from 'rxjs';
import * as storage from './storage';

const cartSubject = new BehaviorSubject({});
const cart = cartSubject.asObservable();

export {
    cart,
    addToCart,
    getCheckout,
    completeCheckout
}

function addToCart(productVariantId, shopifyClient) {
    return new Promise((resolve, reject) => {
        let cartStorage = storage.get();

        if (cartStorage.checkoutId) {
            if (!shopifyClient) {
                console.log('error', 'shopifyClient is not found');
                return;
            }

            shopifyClient.getCheckout(cartStorage.checkoutId).then((cart) => {
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
                cartSubject.next(item);
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
            cartSubject.next(item);
            resolve(item);
        }
    });
}

function getCheckout(shopifyClient) {
    return new Promise((resolve, reject) => {
        if (!shopifyClient) {
            return;
        }

        const cartStorage = storage.get();

        if (!cartStorage.variants || cartStorage.variants.length === 0) {
            reject('There is no item in cart');
            return;
        }

        if (cartStorage.checkoutId) {
            shopifyClient.getCheckout(cartStorage.checkoutId).then((checkout) => {
                if (checkout['order']) {
                    reject('The order has been created successful');
                } else {
                    resolve(checkout);
                }
            });
        } else {
            shopifyClient.createEmptyCheckout().then((result) => {
                cartStorage.checkoutId = result.data.checkoutCreate.checkout.id;
                storage.save(cartStorage);

                shopifyClient.checkoutAddLineItems(cartStorage.checkoutId, cartStorage.variants).then(checkout => {
                    resolve(checkout);
                })
            });
        }
    });
}

function completeCheckout(shopifyClient) {
    const cartStorage = storage.get();

    return new Promise( (resolve, reject) => {
       if (!cartStorage.checkoutId || !shopifyClient) {
           return;
       }

        shopifyClient.getCheckout(cartStorage.checkoutId).then(async (shopifyCheckout) => {
            if (shopifyCheckout['order']) {
                reject('The order has been created successful');
            } else {
                shopifyClient.checkoutReplaceLineItems(cartStorage.checkoutId, cartStorage.variants).then((checkout) => {
                    resolve(checkout);
                });
            }
        });
    });
}
