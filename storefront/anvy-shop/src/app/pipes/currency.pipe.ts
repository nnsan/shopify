import { Pipe, PipeTransform } from '@angular/core';
const numeral = require("numeral");

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return `${numeral(value).format('0,0')}VND`;
  }

}
