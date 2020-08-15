import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ShopifyService, CheckoutService } from '../services';
import { Product } from 'shopify-buy';

@Component({
  selector: 'anvy-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products: Array<any>;
  total: number;
  isLoaded: boolean;

  constructor(
    private httpClient: HttpClient,
    private shopifyService: ShopifyService,
    private checkoutService: CheckoutService
  ) {
    this.isLoaded = false;
  }

  ngOnInit(): void {
    this.products = [];
    this.total = 0;

    this.getAllProducts().subscribe((products) => {
      this.products = products.map((item: Product) => {
        return {
          id: item.id,
          description: item['descriptionHtml'],
          name: item.title,
          price: item.variants[0].price,
          images: item.images,
          variants: item.variants
        }
      });

      this.total = this.products.length;
      this.isLoaded = true;
    })
  }

  getAllProducts(): Observable<Array<Product>> | any {
    return new Observable((subscriber) => {
      this.shopifyService.getAllProducts().then((products) => {
        subscriber.next(products);
        subscriber.complete();
      });
    });
  }

  onAddToCart(item: Product) {
    this.checkoutService.addToCart(item.variants[0], 1);
  }

  listTrackBy(index: number, item: Product): string|number {
    return item.id;
  }
}
