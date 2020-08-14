import * as es6Promise from 'es6-promise';
es6Promise.polyfill();

import 'isomorphic-fetch';
import { Injectable } from '@angular/core';
import { buildClient, Client, Product } from 'shopify-buy';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ShopifyService {
  shopifyClient: Client;

  constructor(private httpClient: HttpClient) {
    // @ts-ignore
    this.shopifyClient = buildClient({ domain: SHOPIFY_STORE, storefrontAccessToken: SHOPIFY_ACCESS_TOKEN, apiVersion: '2020-07' }, fetch);
  }

  getAllProducts(): Promise<Array<Product>> {
    return new Promise((resolve) => {
      this.shopifyClient.product.fetchAll(200).then((products) => {
        resolve(products);
      }).catch((error) => {
        this.handleError(error)
      });
    });
  }

  handleError(e: any) {
    console.log('ShopifyService - handleError');
    console.log(e);
  }
}
