import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {

  transform(value: any, filterTerm: string): any {
    if (!value || !filterTerm) {
      return value;
    }
    return value.filter((user: any) => user.name.toLowerCase().indexOf(filterTerm.toLowerCase()) !== -1);
  }

}
