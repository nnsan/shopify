require('es6-promise').polyfill();
require('isomorphic-fetch');

const dotEnv = require('dotenv');
const koa = require('koa');
const next = require('next');
const session = require('koa-session');

const { default: createShopifyAuth, verifyRequest } = require('@shopify/koa-shopify-auth');
const { default: graphQLProxy, ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const Router = require('koa-router');
const logger = require('koa-logger');
const {receiveWebhook, registerWebhook} = require('@shopify/koa-shopify-webhooks');
const {webhookConfig} = require('./webhookHandler');

dotEnv.config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const {
    SHOPIFY_API_SECRET_KEY,
    SHOPIFY_API_KEY,
    HOST
} = process.env;

function run() {
    const server = new koa();
    const router = new Router();

    // server.use(logger());
    server.use(session({secure: true, sameSite: 'none'}, server));
    server.keys = [SHOPIFY_API_SECRET_KEY];
    server.use(
        createShopifyAuth({
            apiKey: SHOPIFY_API_KEY,
            secret: SHOPIFY_API_SECRET_KEY,
            scopes: [
                'read_products', 'write_products',
                'read_product_listings',
                'read_locations',
                'read_orders', 'write_orders',
                'read_inventory', 'write_inventory',
                'read_fulfillments', 'write_fulfillments',
                'read_assigned_fulfillment_orders', 'write_assigned_fulfillment_orders',
                'read_checkouts', 'write_checkouts',
                'read_content', 'write_content',
                'read_themes', 'write_themes'
            ],
            async afterAuth(ctx) {
                const { shop, accessToken } = ctx.session;
                ctx.cookies.set('shopOrigin', shop, {
                    httpOnly: false,
                    secure: true,
                    sameSite: 'none'
                });
                ctx.cookies.set('accessToken', accessToken);
                const productCreateRegistration = await registerWebhook({
                    address: `${HOST}/webhooks/products/create`,
                    topic: 'PRODUCTS_CREATE',
                    accessToken,
                    shop,
                    apiVersion: ApiVersion.July20
                });
                const orderCreateRegistration = await registerWebhook({
                    address: `${HOST}/webhooks/orders/create`,
                    topic: 'ORDERS_CREATE',
                    accessToken,
                    shop,
                    apiVersion: ApiVersion.July20
                });

                if (productCreateRegistration.success) {
                    console.log('Successfully registered Product Create webhook!');
                } else {
                    console.log('Failed to register webhook', productCreateRegistration.result);
                }

                if (orderCreateRegistration.success) {
                    console.log('Successfully registered Order Create webhook!');
                } else {
                    console.log('Failed to register webhook', orderCreateRegistration.result);
                }

                ctx.redirect('/');
            }
        })
    );
    const webhook = receiveWebhook({secret: SHOPIFY_API_SECRET_KEY});
    webhookConfig(router, webhook);

    server.use(graphQLProxy({version: ApiVersion.July20}));

    router.get('*', verifyRequest(), async (ctx) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;
    });

    server.use(router.allowedMethods());
    server.use(router.routes());

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
}

app.prepare().then(() => {
    run();
});
