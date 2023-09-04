import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IMedicine } from '@interfaces/home/i-medicine';
import { ITopServices, TopUsedMedicalServices } from '@interfaces/home/TopUsedMedicalServices';
import { TopMedicinesService } from '@services/home/top-medicines/top-medicines.service';

@Component({
  selector: 'top-medicines',
  templateUrl: './top-medicines.component.html',
  styleUrls: ['./top-medicines.component.scss'],
})
export class TopMedicinesComponent implements OnInit, OnChanges {
  topMedicines: IMedicine[] = [];
  // topMedicines: TopUsedMedicalServices = {} as TopUsedMedicalServices;

  // topRadiologies: ITopServices[];

  @Input() unSelectedTopMedicineId: number;
  @Output() selectedTopServiceId: EventEmitter<number> = new EventEmitter();
  @Input() topServices: ITopServices[];
  @Input() title: string;

  constructor(private topMedicinesService: TopMedicinesService) {}

  ngOnInit(): void {
    this.getTopMedications();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.topMedicines.forEach((medicine) => {
      if (medicine.id == this.unSelectedTopMedicineId) {
        medicine.isChecked = false;
      }
    });
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   this.topMedicines.topUsedMedications.forEach(m => {
  //     console.log(m);
  //     if(m.id == this.unSelectedTopMedicineId){
  //       m.isChecked =false;
  //     }
  //   })
  //   this.topMedicines.topUsedMedications.topUsedDosages.forEach(m => {
  //     console.log(m);
  //     if(m.id == this.unSelectedTopMedicineId){
  //       m.isChecked =false;
  //     }
  //   })
  // }

  getTopMedications() {
    this.topMedicinesService.getTopMedications().subscribe((response) => {
      this.topMedicines = response.data.topUsedMedications;
      this.topMedicines = response.data.topUsedMedications.topUsedDosages;
      // this.topMedicines.map((m) => {
      //   return (m['isChecked'] = false);
      // });

    });
  }

  // onTopMedicineClick(m) {
  //   console.log('triggered',m);
  //   this.selectedTopServiceId.emit(+m.id);
  //   m.isChecked = true;
  // }
}
