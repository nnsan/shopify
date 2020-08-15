import * as es6Promise from 'es6-promise';
es6Promise.polyfill();

import 'isomorphic-fetch';
import { Injectable } from '@angular/core';
import {
  buildClient,
  Client,
  Product,
  LineItem,
  LineItemToAdd,
  Cart,
  AttributeInput
} from 'shopify-buy';
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

  createCheckout(lineItems: LineItemToAdd[]) {
    return new Promise((resolve) => {
      this.shopifyClient.checkout.create().then((checkout) => {
        this.shopifyClient.checkout.addLineItems(checkout.id, lineItems).then(cart => {
          resolve(cart);
        }).catch((error) => {
          this.handleError(error)
        });
      });
    }).catch((error) => {
      this.handleError(error)
    });
  }

  getCheckout(checkoutId: string): Promise<Cart> | any {
    return new Promise<Cart>((resolve) => {
      this.shopifyClient.checkout.fetch(checkoutId).then((checkout: Cart) => {
        resolve(checkout);
      });
    }).catch((error) => {
      this.handleError(error)
    });
  }

  updateCheckoutLineItems(checkoutId: string, lineItems: LineItemToAdd[]) {
    return new Promise(async (resolve) => {
      let checkout: Cart = await this.getCheckout(checkoutId);

      if (checkout['order']) {
        resolve(checkout);
        return;
      }

      const removedLineItemIds: string[] = checkout.lineItems.reduce((acc, item) => {
        if (!lineItems.some(lineItem => lineItem.variantId == item.variantId)) {
          acc.push(item.id);
        }

        return acc;
      }, []);
      if (removedLineItemIds.length > 0) {
        checkout = await this.shopifyClient.checkout.removeLineItems(checkoutId, removedLineItemIds);
      }

      const updateLineItems = lineItems.filter(lineItem => {
        return checkout.lineItems.some(item => (item.variantId == lineItem.variantId && item.quantity != item.quantity))
      });
      if (updateLineItems.length > 0) {
        checkout = await this.shopifyClient.checkout.updateLineItem(checkoutId, updateLineItems as AttributeInput[]);
      }

      const newLineItems = lineItems.filter(lineItem => {
        if (!checkout.lineItems.some(item => item.variantId == lineItem.variantId)) {
          return lineItem;
        }
      });

      if (newLineItems.length > 0) {
        checkout = await this.shopifyClient.checkout.addLineItems(checkoutId, newLineItems);
      }

      resolve(checkout);
    }).catch((error) => {
      this.handleError(error)
    });
  }

  handleError(e: any) {
    console.log('ShopifyService - handleError');
    console.log(e);
  }
}
