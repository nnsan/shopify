import SERVICE_IDENTIFIER from './src/constant/identifiers';
import container from './src/ioc';
import { IProduct } from './src/interfaces';
import { importData } from './src/services';

const mongoose = require('mongoose');
const bodyParser = require('koa-logger');
const logger = require('koa-logger');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const Koa = require('koa');

const port = parseInt(process.env.PORT as string, 10) || 3001;

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

        server.listen(port, async function () {
            console.log(`The server is runing at port ${port}`);
            await importData();
        });
    });
}

run();
