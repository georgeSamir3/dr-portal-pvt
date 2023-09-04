import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ISmartTableColumn } from '@interfaces/smart-table/i-columns';
import { ISmartTableMessage } from '@interfaces/smart-table/i-message';
import { ISmartTablePagination } from '@interfaces/smart-table/i-pagination';
import { IGliptusPatientList, IItems } from '@models/gliptus-pms/gliptus-pms';
import { GliptusPmsService } from '@services/gliptus-pms/gliptus-pms.service';

@Component({
  selector: 'app-gliptus-patientList',
  templateUrl: './gliptus-patientList.component.html',
  styleUrls: ['./gliptus-patientList.component.scss']
})
export class GliptusPatientListComponent implements OnInit {
  gliptusPatientList: IItems[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number;
  totalItems: number;
  messages: ISmartTableMessage;
  columns: ISmartTableColumn[];
  @ViewChild('visitNumberTemplateRef') public visitNumberTemplateRef: TemplateRef<any>;
  @Output() patientSelected = new EventEmitter<string>();

  constructor(private gliptusPmsService: GliptusPmsService) { }

  ngOnInit() {
    this.getGliptusPatients();
    this.messages = {
      emptyMessage: 'Hmm, There is no patients 😔',
      totalMessage: 'total',
      selectedMessage: 'selected'
    }
  }

  getGliptusPatients() {
    this.gliptusPmsService.getGliptusPatientList(this.currentPage, this.pageSize).subscribe((response) => {
      this.columns = [
        {prop: "patientId", name: "Patient ID", width: 100, minWidth: 100},
        {prop: "fullName", name: "Patient Name", width: 150, minWidth: 150},
        {prop: "phone", name: "Patient Phone", width: 150, minWidth: 150},
        {prop: "visitNumber", name: "Visit Number", cellTemplate: this.visitNumberTemplateRef, sortable: false, width: 300, minWidth: 300}
      ];
      this.gliptusPatientList = response.data.items;
      this.totalPages = response.data?.pagination?.totalPages;
      this.currentPage = response.data?.pagination?.currentPage;
      this.totalItems = response.data?.pagination?.totalItems;
    })
  }

  onChangePage(pageDetails: ISmartTablePagination){
    this.currentPage = pageDetails.offset + 1;
    this.getGliptusPatients();
  }

  onActivate(event) {
    if(event.type == 'click') {
      const phone = event.row.phone;
      this.patientSelected.emit(phone)
    }
  }

  generateArray(n: number): number[] {
    const array = [];
    for (let i = 0; i < n; i++) {
      array.push(i);
    }
    return array;
  }
}
