import 'reflect-metadata';
import { Container } from 'inversify';

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

const container = new Container();


container.bind<IProduct>(SERVICE_IDENTIFIER.PRODUCT).to(Product);
container.bind<IRouter>(SERVICE_IDENTIFIER.ROUTER).to(Router).inSingletonScope();
container.bind<IShopProduct>(SERVICE_IDENTIFIER.SHOP_PRODUCT).to(ShopProduct);


export default container;
