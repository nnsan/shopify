import { injectable, inject } from 'inversify';

import { IProduct, IRouter } from '../interfaces';
import SERVICE_IDENTIFIER from '../constant/identifiers';
import * as fs from 'fs';
import * as path from 'path';

@injectable()
export class ProductMock implements IProduct {

    constructor(@inject(SERVICE_IDENTIFIER.ROUTER) public router: IRouter) {}

    defineRoutes() {
        this.router.get('/product', async (ctx, next) => {
            const data = await this.getAll();
            ctx.body = data;
        });
    }

    getAll(): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            const dataFile = path.join(process.cwd(), 'data.json');
            fs.readFile(dataFile, 'utf8', function (err, data) {
                if (err) {
                    reject(err);
                }

                resolve(JSON.parse(data));
            })
        });
    }
}
