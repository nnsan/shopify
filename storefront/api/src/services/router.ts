import { injectable } from 'inversify';

import { IRouter } from '../interfaces';
const router = require('koa-router');

@injectable()
export class Router implements IRouter {
    public router = new router();

    constructor() {}

    get(path: string, handle: (ctx: any, next: any) => void) {
        this.router.get(path, handle);
    }

    post(path: string, handle: (ctx: any, next: any) => void) {
        this.router.post(path, handle);
    }

    put(path: string, handle: (ctx: any, next: any) => void) {
        this.router.put(path, handle);
    }

    delete(path: string, handle: (ctx: any, next: any) => void) {
        this.router.delete(path, handle);
    }
}
