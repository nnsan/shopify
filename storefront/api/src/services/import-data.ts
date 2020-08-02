import { Product } from '../models';
import { commerce, image, lorem, random } from 'faker';

function isExistedData() {
    return new Promise((resolve, reject) => {
        Product.find({}, function(errors, products) {
            if (products.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

export async function importData() {
    const existed = await isExistedData();

    if (existed) {
        return Promise.resolve();
    }

    console.log('start import data');

    return new Promise(resolve => {
        let totalItem = 0;
        for (let i = 0; i < 100; i++) {
            const item = new Product({
                name: commerce.productName(),
                price: commerce.price(100, 200, 2),
                description: `<div>${new Array(random.number({min: 1, max: 4})).fill(null).map(e => `<p>${lorem.paragraph()}</p>`).join('')}</div>`,
                images: [{
                    type: 'Thumbnail',
                    src: `${image.food(1024, 1024)}?random=${Date.now()}`
                }]
            });
            item.save(function (error) {
                if (error) {
                    console.log(error);
                } else {
                    if (totalItem ==  100) {
                        resolve();
                    }

                    totalItem++;
                }
            });
        }
    });
}
