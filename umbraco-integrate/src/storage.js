import * as Cookies from 'js-cookie';

const KEY = 'ShopifyCart';
export {
    save,
    get,
    remove
}

function save(cartData) {
    Cookies.set(KEY, JSON.stringify(cartData));
}

function get() {
    let cartData = {};
    const value = Cookies.get(KEY);

    if (value) {
        cartData = JSON.parse(value);
    }

    return cartData;
}

function remove() {
    Cookies.remove(KEY);
}
