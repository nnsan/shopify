function webhookConfig(router, webhook) {

    router.post('/webhooks/products/create', webhook, async (ctx) => {
        console.log('received webhook: ', ctx.state.webhook);
    });
    router.post('/webhooks/orders/create', webhook, async (ctx) => {
        console.log('received webhook: ', ctx.state.webhook);
    });
    router.post('/webhooks/customers/data_request', webhook, async (ctx) => {
        console.log('received webhook: ', ctx.state.webhook);
    });
    router.post('/webhooks/shop/redact', webhook, async (ctx) => {
        console.log('received webhook: ', ctx.state.webhook);
    });
    router.post('/webhooks/customers/redact', webhook, async (ctx) => {
        console.log('received webhook: ', ctx.state.webhook);
    });
}

export { webhookConfig };
