import { injectable, inject } from 'inversify';

import { IProduct, IRouter } from '../interfaces';
import SERVICE_IDENTIFIER from '../constant/identifiers';

import { Product as ProductModel} from '../models'

@injectable()
export class Product implements IProduct {

    constructor(@inject(SERVICE_IDENTIFIER.ROUTER) public router: IRouter) {}

    defineRoutes() {
        this.router.get('/product', async (ctx, next) => {
            const data = await this.getAll();
            ctx.body = data;
        });
    }

    getAll(): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            ProductModel.find({}, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(products);
                }
            })
        });
    }
}
