import { Pipe, PipeTransform } from '@angular/core';
import { PrescriptionFulfillmentTypeEnum } from '@enums/home/prescription-fulfillment-type-enum';

@Pipe({
  name: 'getTestPrescriptionName'
})
export class GetTestPrescriptionNamePipe implements PipeTransform {

  transform(value: number[], ...args: unknown[]): unknown {
    if(value.find(v => v === PrescriptionFulfillmentTypeEnum.Radiology))
      return 'Radiology';
    else if(value.find(v => v === PrescriptionFulfillmentTypeEnum.LabTest))
      return 'Lab Test';
    return null;
  }

}
