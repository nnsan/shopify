function onTest() {
    ShopifyService.getProducts().then((data) => {
        console.log(data);
    })
}
