import { Component, OnInit, Inject } from '@angular/core';
import { Cart } from 'shopify-buy';
import { DOCUMENT } from '@angular/common';
import {
  ShopifyService,
  StorageContentType,
  StorageService,
  CheckoutService,
  CheckoutInterface
} from '../services';

@Component({
  selector: 'anvy-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cart: Cart;
  isLoaded: boolean;

  constructor(
    private storageService: StorageService,
    private shopifyService: ShopifyService,
    private checkoutService: CheckoutService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isLoaded = false;
  }

  ngOnInit(): void {
    this.checkoutService.cart.subscribe((item: CheckoutInterface) => {
      if (!item.lineItems) {
        this.isLoaded = true;
        return;
      }

      if(item.id) {
        this.shopifyService.getCheckout(item.id).then((cart) => {
          this.cart = cart;
          this.isLoaded = true;
        })
      } else {
        this.shopifyService.createCheckout(item.lineItems).then((cartData: Cart) => {
          this.cart = cartData;
          item.id = this.cart.id as string;
          this.storageService.save(StorageContentType.checkout, item);
          this.isLoaded = true;
        });
      }
    });
  }

  onCheckOut() {
    this.document.defaultView.open(this.cart['webUrl'], '_blank');
  }
}
