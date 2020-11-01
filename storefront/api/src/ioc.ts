import 'reflect-metadata';
import { Container, interfaces } from 'inversify';

import {
    IProduct,
    IRouter,
    IShopProduct
} from './interfaces';

import {
    Product,
    Router,
    ShopProduct
} from './services'

import SERVICE_IDENTIFIER from './constant/identifiers';
import { ProductMock } from './services/productMock';
import { ShopProductMock } from './services/shopProductMock';

const container = new Container();

container.bind<IRouter>(SERVICE_IDENTIFIER.ROUTER).to(Router).inSingletonScope();
container.bind<IProduct>(SERVICE_IDENTIFIER.PRODUCT).toDynamicValue((context: interfaces.Context) => {
    if (process.env.DATABASE) {
        return new Product(context.container.get(SERVICE_IDENTIFIER.ROUTER));
    } else {
        return new ProductMock(context.container.get(SERVICE_IDENTIFIER.ROUTER));
    }
});
container.bind<IShopProduct>(SERVICE_IDENTIFIER.SHOP_PRODUCT).toDynamicValue((context: interfaces.Context) => {
    if (process.env.DATABASE) {
        return new ShopProduct(context.container.get(SERVICE_IDENTIFIER.ROUTER));
    } else {
        return new ShopProductMock(context.container.get(SERVICE_IDENTIFIER.ROUTER));
    }
});



export default container;
