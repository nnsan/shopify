import { injectable, inject } from 'inversify';

import { IShopProduct, IRouter } from '../interfaces';
import SERVICE_IDENTIFIER from '../constant/identifiers';

@injectable()
export class ShopProductMock implements IShopProduct {

    constructor(@inject(SERVICE_IDENTIFIER.ROUTER) public router: IRouter) {}

    defineRoutes() {
        this.router.get('/shop-product/:name', async (ctx, next) => {
            const data = await this.getProducts(ctx.params.name);
            ctx.body = data;
        });

        this.router.post('/shop-product', async (ctx, next) => {
            const requestBody = ctx.request.body;
            const data = await this.createProducts(requestBody.shopOrigin, requestBody.products);
            ctx.body = data;
        });
    }

    getProducts(shop: string): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve({});
        });
    }

    createProducts(shop: string, products: Array<any>): Promise<any> {
        return new Promise(async (resolve, reject) => {
            resolve({});
        });
    }
}
