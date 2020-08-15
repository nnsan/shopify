import { Injectable } from '@angular/core';
import * as Cookies from 'js-cookie';

export enum StorageContentType {
  checkout = 'Checkout',
  other = 'Other'
}

@Injectable()
export class StorageService {
  private prefix = 'ANVY';

  constructor() { }

  save(contentType: StorageContentType, value: any) {
    Cookies.set(`${this.prefix}_${contentType}`, value);
  }

  get(contentType: StorageContentType) {
    let result: any;

    switch (contentType) {
      case StorageContentType.checkout:
        result = Cookies.getJSON(`${this.prefix}_${contentType}`) || {};
        break;
      case StorageContentType.other:
        break;
      default:
        result = Cookies.get(`${this.prefix}_${contentType}`)
    }
    return result;
  }

  delete(contentType: StorageContentType) {
    switch (contentType) {
      case StorageContentType.checkout:
        Cookies.remove(`${this.prefix}_${contentType}`);
        break;
      case StorageContentType.other:
        break;
      default:
        console.log('There is no key');
    }
  }
}
