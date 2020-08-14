import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from 'shopify-buy';
import { StorageContentType, StorageService } from './index'

@Injectable()
export class CheckoutService {
  private cartSubject = new BehaviorSubject<number>(0);
  public cart: Observable<number>;

  constructor(private storageService: StorageService) {
    const existedItems = this.storageService.get(StorageContentType.checkout);
    this.cart = this.cartSubject;
    this.cartSubject.next(existedItems.length);
  }

  addToCart(item: Product) {
    const existedItems = this.storageService.get(StorageContentType.checkout);

    if (!existedItems.includes(p => p.id === item.id)) {
      existedItems.push({
        id: item.id
      });
      this.storageService.save(StorageContentType.checkout, existedItems);
      this.cartSubject.next(existedItems.length);
    }
  }
}
