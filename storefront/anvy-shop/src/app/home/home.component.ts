import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ElementRef
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'anvy-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isBrowser: boolean;
  products: Array<any>;
  carousel: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private elementRef: ElementRef,
    private httpClient: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      require('owl.carousel');

      // @ts-ignore
      this.carousel = $(this.elementRef.nativeElement).find('.owl-carousel');

      this.getFamousProducts().subscribe((products) => {
        this.products = products.slice(0, 10);
        setTimeout(() => {
          this.carousel.owlCarousel({
            items: 1,
            margin: 0,
            autoplay: true
          });
        });
      });
    }
  }

  getFamousProducts(): Observable<Array<any>> {
    return this.httpClient.get<Array<any>>('/product');
  }

}
