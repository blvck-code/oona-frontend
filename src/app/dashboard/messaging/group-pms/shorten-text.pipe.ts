import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenText'
})
export class ShortenTextPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    // tslint:disable-next-line:no-shadowed-variable
      return value.map((value: { full_name: any; }) => value.full_name);
  }

}
