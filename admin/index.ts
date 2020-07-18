import container from './src/ioc';
import mongoose from 'mongoose';

import {
    Product
} from './src/interfaces';

import SERVICE_IDENTIFIER from './src/constant/identifiers';
import { importData } from './src/services';

function run() {
    const server = container.get<any>(SERVICE_IDENTIFIER.SERVER);
    const product = container.get<Product>(SERVICE_IDENTIFIER.PRODUCT);

    product.defineRoutes();

    mongoose.connect('mongodb://localhost:27017/anvyShop', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(() => {
        server.listen('3001', async function () {
            await importData();
        });
    });
}

run();
