import * as es6Promise from 'es6-promise';
es6Promise.polyfill();

import 'isomorphic-fetch';
import * as dotenv from 'dotenv';
import Koa from 'koa';
import Router from 'koa-router';
import Logger from 'koa-logger';
import next from 'next';
import Session from 'koa-session';
import createShopifyAuth, * as koaShopifyAuth from '@shopify/koa-shopify-auth';
import graphQLProxy, * as shopifyGraphqlProxy from '@shopify/koa-shopify-graphql-proxy';
import * as shopifyWebhook from '@shopify/koa-shopify-webhooks';

import { webhookConfig }  from "./webhookHandler.js";

dotenv.config();

const { receiveWebhook, registerWebhook } = shopifyWebhook;
const ApiVersion = shopifyGraphqlProxy.ApiVersion;
const verifyRequest = koaShopifyAuth.verifyRequest;
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
    const server = new Koa();
    const router = new Router();

    // server.use(Logger());
    server.use(Session({secure: true, sameSite: 'none'}, server));
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
    server.use(router.routes());
    server.use(router.allowedMethods());

    server.use(async (ctx) => {
        await verifyRequest();
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;
    });

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
}

app.prepare().then(() => {
    run();
});
