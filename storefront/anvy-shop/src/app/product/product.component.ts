import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'anvy-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  products: Array<any>;
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getAllProducts().subscribe((data) => {
      this.products = data;
    })
  }

  getAllProducts(): Observable<Array<any>> {
    return this.httpClient.get<Array<any>>('/product');
  }
}
