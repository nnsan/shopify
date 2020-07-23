import SERVICE_IDENTIFIER from './src/constant/identifiers';
import container from './src/ioc';
import { IProduct } from './src/interfaces';
import mongoose from 'mongoose';
import { importData } from './src/services';

import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import Koa from 'koa';

function run() {
    const middleWare = container.get<any>(SERVICE_IDENTIFIER.ROUTER);
    const product = container.get<IProduct>(SERVICE_IDENTIFIER.PRODUCT);

    product.defineRoutes();

    mongoose.connect('mongodb://localhost:27017/anvyShop', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(() => {
        const server = new Koa();

        server.use(logger())
            .use(bodyParser())
            .use(helmet())
            .use(cors())
            .use(middleWare.router.routes());

        server.listen('3001', async function () {
            await importData();
        });
    });
}

run();
