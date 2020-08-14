import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { httpInterceptorProviders } from './http-interceptors';
import { CurrencyPipe, CheckoutBadgePipe } from './pipes';
import {
  ShopifyService,
  StorageService,
  CheckoutService
} from './services';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductComponent } from './product/product.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { CheckoutComponent } from './checkout/checkout.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductComponent,
    HomeComponent,
    ContactComponent,
    CurrencyPipe,
    CheckoutComponent,
    CheckoutBadgePipe
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [
    httpInterceptorProviders,
    ShopifyService,
    StorageService,
    CheckoutService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
