import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { compareVersions, getCurrentAppVersion } from '@helpers/compare-versions';
import { showNotification } from '@helpers/show-toast';
import { IDrugDrugInteractionResponse, IDrugRxcuiResponse, IInteractionNotificationDTO } from '@interfaces/home/i-drug-drug-interaction';
import { IMedicine, ISelectedMedicineDTO } from '@interfaces/home/i-medicine';
import { IResponse } from '@interfaces/i-response';
import { DrugsInteractionModalComponent } from '@pages/home/components/drugs-interaction-modal/drugs-interaction-modal.component';
import { AppVersionsService } from '@services/home/app-versions/app-versions.service';
import { CreateEPrescriptionService } from '@services/home/create-e-prescription/create-e-prescription.service';
import { DrugDrugInteractionService } from '@services/home/drug-drug-interactions/drug-drug-interaction.service';
import {
  BsModalRef, BsModalService,
  ModalOptions
} from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, concat, merge, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-drug-drug-interaction',
  templateUrl: './drug-drug-interaction.component.html',
  styleUrls: ['./drug-drug-interaction.component.scss']
})
export class DrugDrugInteractionComponent implements OnInit {
  interactionNotificationDetails: IInteractionNotificationDTO;
  modalRef: BsModalRef;
  medicinesItems$: Observable<IMedicine[]>;
  medicinesTypeahead$ = new Subject<string>();
  medicinesList: IMedicine[] = [];
  selectedMedicines: IMedicine[] = [];
  medicinesListTemp: IMedicine[] = [];
  filteredMedicinesList: IMedicine[] = [];
  selectedMedicinesRxcuis: string[] = [];
  keyUpSubjectDrug = new Subject<string>();
  medicineForm = new FormGroup({
    medicines: new FormControl([], Validators.required)
  })

  constructor(
    private modalService: BsModalService,
    private createEPrescriptionService: CreateEPrescriptionService,
    private appVersionsService: AppVersionsService,
    private toastr: ToastrService,
    private drugDrugInteractionService: DrugDrugInteractionService
  ) { }

  ngOnInit() {
    this.keyUpSubjectDrug
    .pipe(debounceTime(500)) // Debounce the event stream by 500 milliseconds
    .subscribe((searchTerm: string) => {
      this.getDrugIndexBySearch(searchTerm);
    });
  }

  onKeyUpDrugIndex(event: any): void {
    // Emit the input value to the Subject, triggering the debounce timer
    this.keyUpSubjectDrug.next(event.target.value);
  }

  generateSelectedMedicines() {

    if (this.medicineForm.value.medicines?.length) {

      this.selectedMedicines = [];
      for (let medicineId of this.medicineForm.value.medicines) {
        let medicineItem = this.medicinesListTemp.find(
          (item) => item.id === medicineId
        );
        this.selectedMedicines.push(medicineItem);
      }
    }
  }
 
  checkDrugDrugInteraction() {
    let previousSelectedMedicines = [...this.selectedMedicines];
    this.generateSelectedMedicines();
    this.selectedMedicinesRxcuis = [];
    if (JSON.stringify(previousSelectedMedicines) == JSON.stringify(this.selectedMedicines)
      && this.interactionNotificationDetails?.descriptions?.length > 0) {
      this.openDrugsInteractionModal();
      return;
    }

    let selectedMedicinesWithGenericName = this.selectedMedicines.filter(m => m.genericName);
    if (selectedMedicinesWithGenericName.length <= 1) {
      showNotification('danger', 'You Need to Choose at least two medicines, to check Interaction', this.toastr)
      return;
    }

    let returnedRxcuis$: Observable<{ api: IDrugRxcuiResponse, genericName: string }> = merge(...selectedMedicinesWithGenericName
      .map(m => this.drugDrugInteractionService.getDrugRxcui(m.genericName)));
    returnedRxcuis$.subscribe({
      next: (res) => {
        let rxnavDrugGroup = res.api.drugGroup.conceptGroup?.find(c => c.tty == "SCD");
        let rxnavDrug = (rxnavDrugGroup && rxnavDrugGroup.conceptProperties) ? rxnavDrugGroup.conceptProperties[0] : null;
        this.selectedMedicinesRxcuis.push(rxnavDrug?.rxcui);
        this.selectedMedicinesRxcuis = this.selectedMedicinesRxcuis.filter(m => m);
        this.selectedMedicines.find(sm => sm.genericName == res.genericName)
          .rxnavGenericName = rxnavDrug?.name;
      },
      complete: () => {
        if (this.selectedMedicinesRxcuis.length <= 1) {
          showNotification('success', ' These Drugs do not have any interactions.', this.toastr);
          return;
        }

        this.drugDrugInteractionService.getDrugDrugInteraction(this.selectedMedicinesRxcuis).subscribe(
          res => {
            if (res.fullInteractionTypeGroup && res.fullInteractionTypeGroup.length > 0) {
              this.interactionNotificationDetails = this.mapDrugInteractions(res);
              this.openDrugsInteractionModal();
            }
          }
        )
      }
    });
  }

  mapDrugInteractions(interactionRsponse: IDrugDrugInteractionResponse): IInteractionNotificationDTO {
    let interactionGroup = interactionRsponse.fullInteractionTypeGroup?.find(i => i.sourceName == "ONCHigh")
      || interactionRsponse.fullInteractionTypeGroup[0];

    let interactionDetails = interactionGroup.fullInteractionType.reduce((acc, current) => {
      return {
        medicines: current.interactionPair.reduce((accumIp, currentIp) => {
          let medicinesWithUrls = {};

          currentIp.interactionConcept.forEach(ic =>
            medicinesWithUrls[ic.sourceConceptItem.name] =
            ic.sourceConceptItem.url != "NA" ? ic.sourceConceptItem.url : interactionGroup.sourceDisclaimer)

          return { ...acc.medicines, ...medicinesWithUrls };
        }, {}),
        severities: [...acc.severities, current.interactionPair[0].severity],
        descriptions: [...acc.descriptions, current.interactionPair[0].description]
      };
    }, { medicines: {}, severities: [], descriptions: [] });

    let mappedMedicines = [];
    
    
    for (const prop in interactionDetails.medicines) {
      mappedMedicines.push({
        genericName: prop, url: interactionDetails.medicines[prop],
        tradeName: this.selectedMedicines.find(sm => sm.rxnavGenericName
          && sm.rxnavGenericName.toLowerCase().includes(prop.toLowerCase()))?.name
      });
    }
    interactionDetails.medicines = mappedMedicines;
    console.log("selectedmed", interactionDetails.medicines  );
    interactionDetails.severities = [...new Set(interactionDetails.severities)]
      .filter(s => s != "N/A" && s != "NA");
    return interactionDetails as IInteractionNotificationDTO;
  }

  openDrugsInteractionModal() {
    const initialState: ModalOptions<any> = {
      keyboard: true,
      class: 'modal-dialog-centered',
      initialState: {
        title: 'Drug Drug Interactions',
        details: this.interactionNotificationDetails
      }
    };
    this.modalRef = this.modalService.show(
      DrugsInteractionModalComponent,
      initialState
    );

  }


  getDrugIndexBySearch(event) {
    if (event?.length > 1) {
      this.createEPrescriptionService
        .getDrugIndexBySearch(event)
        .subscribe((response: IResponse<IMedicine[]>) => {
          if (this.medicinesListTemp.length > 0) {
            this.medicinesList = response.data;
            this.medicinesListTemp = [...this.medicinesListTemp, ...this.medicinesList];
            
          }
          else {
            this.medicinesList = response.data;
            this.medicinesListTemp = [];
            this.medicinesListTemp = response.data;
          }
          
          this.onSearchMedicinesList();
        });
    }
    else {
      this.medicinesList = [];
      this.onSearchMedicinesList();
    }
  }

  onSearchMedicinesList() {
    this.medicinesItems$ = concat(
      of([...this.medicinesList]),
      this.medicinesTypeahead$.pipe(
        distinctUntilChanged(),
        switchMap((searchTerm: string) => {
          this.filteredMedicinesList = [...this.medicinesList];
          if (searchTerm) {
            this.filteredMedicinesList = this.onSortList(
              this.filteredMedicinesList,
              'name',
              searchTerm
            );
          }
          return of(this.filteredMedicinesList);
        })
      )
    );
  }

  onSortList(list, searchKey, searchTerm) {
    searchTerm = searchTerm
      .split(' ')
      .join('')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .toLowerCase();

    return list
      .filter(
        (filteredItem) =>
          filteredItem.name
            .split(' ')
            .join('')
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .toLowerCase()
            .indexOf(searchTerm) > -1
      )
      .sort((a, b) => {
        const aStarts = a[searchKey].toLowerCase().startsWith(searchTerm);
        const bStarts = b[searchKey].toLowerCase().startsWith(searchTerm);
        if (aStarts && bStarts) return a[searchKey].localeCompare(b[searchKey]);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a[searchKey].localeCompare(b[searchKey]);
      });
  }

  trackByFn(item) {
    return item.id;
  }

}
