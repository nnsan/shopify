const service = new ShopifyService.default({
    url: 'nashtechglobal.myshopify.com',
    token: 'a2a3c61e2279ee3c67388d8a822b42b1'
});

service.cart.observable.subscribe((data) => {
    console.log(data);
});

function getAllProducts() {
    service.getProducts(2).then((data) => {
        console.log(data);
    });
}

function searchProductByTitle() {
    const title = [
        'Clear Varnish',
        'Floor Paint'
    ];
    service.searchProductByTitle(title).then((data) => {
        console.log(data);
    });
}

function addToCart() {
    service.cart.addToCart('Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zNTgyMTQ5ODg1OTY4NQ==').then((cart) => {
        console.log(cart);
    }, (message) => {
        console.log(message);
    });
}

function viewCart() {
    service.cart.getCheckout().then((checkout) => {
        console.log(checkout);
    }, (message) => {
        console.log(message);
    })
}

function checkout() {
    service.cart.completeCheckout().then((checkout) => {
        console.log(checkout);
        window.open(checkout['webUrl'], '_blank');
    }, (message) => {
        console.log(message);
    })
}
