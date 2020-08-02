require('es6-promise').polyfill();
require('isomorphic-fetch');

const dotEnv = require('dotenv');
const koa = require('koa');
const next = require('next');
const session = require('koa-session');

const { default: createShopifyAuth, verifyRequest } = require('@shopify/koa-shopify-auth');
const { default: graphQLProxy, ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');

dotEnv.config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

function run() {
    const server = new koa();

    server.use(session({secure: true, sameSite: 'none'}, server));
    server.keys = [SHOPIFY_API_SECRET_KEY];
    server.use(
        createShopifyAuth({
            apiKey: SHOPIFY_API_KEY,
            secret: SHOPIFY_API_SECRET_KEY,
            scopes: ['read_products', 'write_products'],
            afterAuth(ctx) {
                const { shop, accessToken } = ctx.session;

                ctx.cookies.set('shopOrigin', shop, {
                    httpOnly: false,
                    secure: true,
                    sameSite: 'none'
                });
                ctx.cookies.set('accessToken', accessToken);

                ctx.redirect('/');
            }
        })
    );
    server.use(graphQLProxy({version: ApiVersion.July20}));
    server.use(verifyRequest());
    server.use(async (ctx) => {
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



