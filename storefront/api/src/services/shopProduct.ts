import { injectable, inject } from 'inversify';

import { IShopProduct, IRouter } from '../interfaces';
import SERVICE_IDENTIFIER from '../constant/identifiers';

import { ShopProduct as ShopProductModel} from '../models'

@injectable()
export class ShopProduct implements IShopProduct {

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
            ShopProductModel.findOne({shopOrigin: shop}, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(products);
                }
            })
        });
    }

    createProducts(shop: string, products: Array<any>): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let item: any = await ShopProductModel.findOne({shopOrigin: shop}).exec();

            if (item) {
                item.products = products;
            } else {
                item = new ShopProductModel({
                    shopOrigin: shop,
                    products: products
                });
            }

            await item.save(function (error: any) {
                if (error) {
                    reject(error);
                } else {
                    resolve({});
                }
            })
        });
    }
}
