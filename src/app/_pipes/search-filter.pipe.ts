import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(filteredArray: any, searchText?: any): any {
    if (!filteredArray) return null;
    if (!searchText) return filteredArray;

    searchText = searchText.toLowerCase();

    return filteredArray.filter((filteredArrayItem) => {
      return JSON.stringify(filteredArrayItem).toLowerCase().includes(searchText);
    });
  }
}
