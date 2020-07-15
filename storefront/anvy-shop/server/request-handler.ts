import * as express from 'express';

export default function requestHandler(app: express.Express) {
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  app.get('/api/product', (req, res) => {
    res.send('hello');
  });
}
