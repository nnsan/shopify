import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ShopifyService, CheckoutService, StorageContentType } from '../services';
import { Product } from 'shopify-buy';

@Component({
  selector: 'anvy-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  products: Array<any>;
  total: number;

  constructor(
    private httpClient: HttpClient,
    private shopifyService: ShopifyService,
    private checkoutService: CheckoutService
  ) { }

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
          images: item.images
        }
      });

      this.total = this.products.length;
    })
  }

  getAllProducts(): Observable<Array<Product>> | any {
    // return this.httpClient.get<Array<any>>('/product');
    return new Observable((subscriber) => {
      this.shopifyService.getAllProducts().then((products) => {
        subscriber.next(products);
        subscriber.complete();
      });
    });
  }

  onAddToCart(item: Product) {
    this.checkoutService.addToCart(item);
  }

  listTrackBy(index: number, item: Product): string|number {
    return item.id;
  }
}
