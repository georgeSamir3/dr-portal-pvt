import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getChannelName'
})
export class GetChannelNamePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    if(value === 1)
      return 'Application';
    else if(value === 2)
      return 'Admin';
    else if(value === 3)
      return 'Portal'
    return null;
  }

}
