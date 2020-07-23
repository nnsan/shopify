import 'reflect-metadata';
import { Container } from 'inversify';

import {
    IProduct,
    IRouter
} from './interfaces';

import {
    Product,
    Router
} from './services'

import SERVICE_IDENTIFIER from './constant/identifiers';

const container = new Container();


container.bind<IProduct>(SERVICE_IDENTIFIER.PRODUCT).to(Product);
container.bind<IRouter>(SERVICE_IDENTIFIER.ROUTER).to(Router).inSingletonScope();


export default container;
