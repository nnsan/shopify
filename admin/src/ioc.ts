import 'reflect-metadata';
import { Container } from 'inversify';

import {
    Product as IProduct,
    Server as IServer
} from './interfaces';

import {
    Product,
    Server
} from './services'

import SERVICE_IDENTIFIER from './constant/identifiers';

const container = new Container();

console.log('ioc container');

container.bind<IProduct>(SERVICE_IDENTIFIER.PRODUCT).to(Product);
container.bind<IServer>(SERVICE_IDENTIFIER.SERVER).to(Server).inSingletonScope();

export default container
