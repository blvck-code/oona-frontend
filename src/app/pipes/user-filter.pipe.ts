import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {

  transform(value: any, filterTerm: string): any {
    if (!value || !filterTerm) {
      return value;
    }

    if (value.name) {
      console.log(value.name);
    }
    return value.filter((user: any) => user.full_name.toLowerCase().indexOf(filterTerm.toLowerCase()) !== -1);
  }

}
