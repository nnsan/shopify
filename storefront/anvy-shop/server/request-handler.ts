import * as express from 'express';
import Product from './model/product';

export default function requestHandler(app: express.Express) {
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  app.get('/api/product', async (req, res) => {
    const allProducts = await Product.find({});

    res.json(allProducts);
  });
}
