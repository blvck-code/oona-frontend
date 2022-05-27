import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchUser'
})

export class SearchUserPipe implements PipeTransform {
  transform(items: any[], searchText: string): any{
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    // searchText = searchText.toLowerCase();
    // return items.filter( it => {
    //   return it.toLowerCase().includes(searchText);
    // });
    return items.filter((user: any) => user.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  }
}
