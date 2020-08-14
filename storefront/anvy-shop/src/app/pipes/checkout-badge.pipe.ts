import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkoutBadge'
})
export class CheckoutBadgePipe implements PipeTransform {

  transform(value: number): string|number {
    return value > 0 ? (value >= 10 ? '9+': value) : '';
  }

}
