import { injectable } from 'inversify';

import { IRouter } from '../interfaces';
const router = require('koa-router');

@injectable()
export class Router implements IRouter {
    public router = new router();

    constructor() {}

    get(path: string, handle: (ctx, next) => void) {
        this.router.get(path, handle);
    }

    post(path: string, handle: (ctx, next) => void) {
        this.router.get(path, handle);
    }

    put(path: string, handle: (ctx, next) => void) {
        this.router.get(path, handle);
    }

    delete(path: string, handle: (ctx, next) => void) {
        this.router.get(path, handle);
    }
}
