import { Component, OnInit ,EventEmitter,
  Input,Output,} from '@angular/core';
import { ITopServices, TopUsedMedicalServices } from '@interfaces/home/TopUsedMedicalServices';
import { TopMedicinesService } from '@services/home/top-medicines/top-medicines.service';

@Component({
  selector: 'app-GeneralTopUsedServices',
  templateUrl: './GeneralTopUsedServices.component.html',
  styleUrls: ['./GeneralTopUsedServices.component.scss']
})
export class GeneralTopUsedServicesComponent implements OnInit {
  topMedicines: TopUsedMedicalServices = {} as TopUsedMedicalServices;
  topRadiologies: ITopServices[];

  @Output() unSelectedTopMedicineId: EventEmitter<number> = new EventEmitter();
  @Output() selectedTopServiceId: EventEmitter<number> = new EventEmitter();
  @Input() topServices: ITopServices[];
  @Input() title: string;
  @Input() Text: string;
  constructor(private topMedicinesService: TopMedicinesService) { }

  ngOnInit() {
  }
  onTopMedicineClick(m) {
    this.selectedTopServiceId.emit(+m.id);
    m.isChecked = true;
  }

}
