import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSpecialCharacters'
})
export class RemoveSpecialCharactersPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return value.replace(/[^\w]/g, '');
  }

}
