import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayNames'
})
export class DisplayNamesPipe implements PipeTransform {

  transform(value: any, name: string): unknown {

    return value.map((member: { full_name: any; }) => member.full_name).filter((personName: string) => personName !== name);
  }

}
