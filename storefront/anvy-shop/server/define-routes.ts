import * as express from 'express';

export default function defineRoutes(app: express.Express) {
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  app.get('/api/product', async (req, res) => {
    // TODO get products from Shopify through JS Buy SDK
    res.json({});
  });
}
