import SERVICE_IDENTIFIER from './src/constant/identifiers';
import container from './src/ioc';
import { IProduct, IShopProduct } from './src/interfaces';
import { importData } from './src/services';

const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const Koa = require('koa');

require('dotenv-safe').config({
    allowEmptyValues: true
});

const port = parseInt(process.env.PORT as string, 10);

function run() {
    if (process.env.DATABASE) {
        mongoose.connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }).then(async () => {
            startServer();
            await importData();
        });
    } else {
        console.log('Run with mock mode');
        startServer();
    }
}

function startServer() {
    const middleWare = container.get<any>(SERVICE_IDENTIFIER.ROUTER);
    const product = container.get<IProduct>(SERVICE_IDENTIFIER.PRODUCT);
    const shopProduct = container.get<IShopProduct>(SERVICE_IDENTIFIER.SHOP_PRODUCT);

    product.defineRoutes();
    shopProduct.defineRoutes();
    const server = new Koa();

    server.use(logger())
        .use(bodyParser())
        .use(helmet())
        .use(cors())
        .use(middleWare.router.routes())
        .use(middleWare.router.allowedMethods());

    server.listen(port, async function () {
        console.log(`The api server is running at port ${port}`);
    });
}

run();
