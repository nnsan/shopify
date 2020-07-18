import { injectable, inject } from 'inversify';

import { Product as IProduct, Server } from '../interfaces';
import SERVICE_IDENTIFIER from '../constant/identifiers';

import { Product as ProductModel} from '../models'

@injectable()
export class Product implements IProduct {

    constructor(@inject(SERVICE_IDENTIFIER.SERVER) public server: Server) {}

    defineRoutes() {
        this.server.get('/product', async (req, res) => {
            const data = await this.getAll();
            res.json(data);
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
