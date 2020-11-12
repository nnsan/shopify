import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, LineItem, ProductVariant } from 'shopify-buy';
import { ShopifyService, StorageContentType, StorageService } from './index';

export interface CheckoutInterface {
  id: string,
  lineItems: Array<any>
}

@Injectable()
export class CheckoutService {
  private cartSubject = new BehaviorSubject<CheckoutInterface | any>({});
  public cart: Observable<CheckoutInterface>;

  constructor(
    private storageService: StorageService,
    private shopifyService: ShopifyService
  ) {
    const checkoutItem = this.storageService.get(StorageContentType.checkout);
    this.cart = this.cartSubject;

    if (checkoutItem.id) {
      this.syncCheckout(checkoutItem);
    } else {
      this.cartSubject.next(checkoutItem);
    }
  }

  syncCheckout(checkoutItem) {
    this.shopifyService.getCheckout(checkoutItem.id).then((checkout: Cart) => {
      if (checkout['order']) {
        this.storageService.delete(StorageContentType.checkout);
        return;
      }

      const lineItems = checkout.lineItems.map((lineItem: LineItem) => {
        return {
          variantId: lineItem['variant'].id,
          quantity: lineItem.quantity
        }
      });

      const item = {
        id: checkout.id,
        lineItems
      };

      this.storageService.save(StorageContentType.checkout, item);
      this.cartSubject.next(item);
    });
  }

  addToCart(item: ProductVariant, quantity: number) {
    let checkoutItem = this.storageService.get(StorageContentType.checkout);
    const lineItems = checkoutItem.lineItems || [];

    const existedItem = lineItems.find(lineItem => lineItem && lineItem.variantId === item.id);

    if (existedItem) {
      checkoutItem.lineItems = lineItems.map(lineItem => {
        if (lineItem.variantId == item.id) {
          lineItem.quantity = lineItem.quantity + 1;
        }

        return lineItem;
      })
    } else {
      lineItems.push({
        variantId: item.id,
        quantity: quantity
      });

      checkoutItem.lineItems = lineItems;
    }

    if (checkoutItem.id) {
      this.shopifyService.updateCheckoutLineItems(checkoutItem.id, checkoutItem.lineItems).then((checkout) => {
        if (checkout['order']) {
          this.storageService.delete(StorageContentType.checkout);
          checkoutItem = {
            lineItems: [{
              variantId: item.id,
              quantity: quantity
            }]
          };
        }

        this.storageService.save(StorageContentType.checkout, checkoutItem);
        this.cartSubject.next(checkoutItem);

      });
    } else {
      this.storageService.save(StorageContentType.checkout, checkoutItem);
      this.cartSubject.next(checkoutItem);
    }
  }
}
