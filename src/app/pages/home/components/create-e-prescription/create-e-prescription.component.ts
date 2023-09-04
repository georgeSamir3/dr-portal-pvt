import {
  AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren
} from '@angular/core';
import {
  AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelTypeEnum } from '@enums/home/channel-type.enum';
import { TestType } from '@enums/home/test-type.enum';
import { compareVersions, getCurrentAppVersion } from '@helpers/compare-versions';
import { getSingularPluralPeriod } from '@helpers/period-singular-plural-checker';
import { showNotification } from '@helpers/show-toast';
import { ITopDiagnosesServices, ITopMedicinesServices, ITopServicesWithTypes, TopUsedMedicalServices } from '@interfaces/home/TopUsedMedicalServices';
import { IDiagnose } from '@interfaces/home/i-disgnose';
import { IDrugDrugInteractionResponse, IDrugRxcuiResponse, IInteractionNotificationDTO } from '@interfaces/home/i-drug-drug-interaction';
import { IFrequencyPeriodDirection } from '@interfaces/home/i-frequency-period-direction';
import { ILabTest } from '@interfaces/home/i-lab-test';
import { IMedicine, ISelectedMedicineDTO } from '@interfaces/home/i-medicine';
import { IPatient } from '@interfaces/home/i-patient';
import { IPhysiotherapy } from '@interfaces/home/i-physiotherapy';
import { RXDoctorInfo, RXHeaderInfo, RXPatientInfo } from '@interfaces/home/i-print-section';
import { IRadiology } from '@interfaces/home/i-radiology';
import { IHospital } from '@interfaces/home/iHospital';
import { IBreadcrumbItem } from '@interfaces/i-breadcrumb-item';
import { IResponse } from '@interfaces/i-response';
import { DrugModel } from '@models/home/drug.model';
import { AppVersionsService } from '@services/home/app-versions/app-versions.service';
import { CreateEPrescriptionService } from '@services/home/create-e-prescription/create-e-prescription.service';
import { DrugDrugInteractionService } from '@services/home/drug-drug-interactions/drug-drug-interaction.service';
import { HomeService } from '@services/home/home.service';
import { TopMedicinesService } from '@services/home/top-medicines/top-medicines.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, concat, merge, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BooleanQuestionAnswer } from 'src/app/_constants/booleanQuestionAnswer';
import { DrugsInteractionModalComponent } from '../drugs-interaction-modal/drugs-interaction-modal.component';
@Component({
  selector: 'create-e-prescription',
  templateUrl: './create-e-prescription.component.html',
  styleUrls: ['./create-e-prescription.component.scss'],
})
export class CreateEPrescriptionComponent implements OnInit, AfterViewInit {
  booleanAnswer = BooleanQuestionAnswer;
  createPersonalPatientDataForm = new FormGroup({
    patientId: new FormControl(Number(this.route.snapshot.params.patientId), [Validators.required]),
    patientName: new FormControl(),
    phone: new FormControl(),
    bloodType: new FormControl(),
  });
  createVitalsDataForm = new FormGroup({
    height: new FormControl(),
    weight: new FormControl(),
    isSmoker: new FormControl(),
    isAlcoholic: new FormControl(),
    heartRate: new FormControl(),
    temperature: new FormControl(),
    respiratoryRate: new FormControl(),
    oxygenSaturation: new FormControl(),
    bloodPressure: new FormControl(),
  });
  pageTitle: string = 'Create E-Prescription';
  breadcrumbList: IBreadcrumbItem[] = [
    { text: 'Create E-Prescription', link: '' },
  ];
  bloodPressureTop: number | null;
  bloodPressureBottom: number | null;
  patientId: string = '';
  prescriptionForm: FormGroup;
  diagnosesList: IDiagnose[] = [];
  topDiagnosesList: IDiagnose[] = [];
  filteredDiagnosesList: IDiagnose[] = [];
  diagnosesItems$: Observable<IDiagnose[]>;
  diagnosesTypeahead$ = new Subject<string>();
  medicinesList: IMedicine[] = [];
  topMedicinesList: IMedicine[] = [];
  filteredMedicinesList: IMedicine[] = [];
  medicinesItems$: Observable<IMedicine[]>;
  medicinesTypeahead$ = new Subject<string>();
  labTestsList: ILabTest[] = [];
  topLabTestsList: ILabTest[] = [];
  filteredLabTestsList: ILabTest[] = [];
  labTestsItems$: Observable<ILabTest[]>;
  labTestsTypeahead$ = new Subject<string>();
  radiologyList: IRadiology[] = [];
  topRadiologyList: IRadiology[] = [];
  filteredRadiologyList: IRadiology[] = [];
  radiologyItems$: Observable<IRadiology[]>;
  radiologyTypeahead$ = new Subject<string>();
  physiotherapyList: IPhysiotherapy[] = [];
  topPhysiotherapyList: IPhysiotherapy[] = [];
  filteredPhysiotherapyList: IPhysiotherapy[] = [];
  physiotherapyItems$: Observable<IPhysiotherapy[]>;
  physiotherapyTypeahead$ = new Subject<string>();
  HospitalList: IHospital[] = [];
  topHospitalList: IHospital[] = [];
  filteredHospitalList: IHospital[] = [];
  HospitalItems$: Observable<IHospital[]>;
  HospitalTypeahead$ = new Subject<string>();
  drugModel: DrugModel;
  drugDosageCount: IFrequencyPeriodDirection[];
  drugFrequencyCount: IFrequencyPeriodDirection[];
  drugFrequencyPeriod: IFrequencyPeriodDirection[];
  drugPeriodCount: IFrequencyPeriodDirection[];
  drugPeriodPeriod: IFrequencyPeriodDirection[];
  drugDirectionList: IFrequencyPeriodDirection[];
  isPrintSubscription: boolean = false;
  selectedMedicines: ISelectedMedicineDTO[] = [];
  selectedDiagnoses: IDiagnose[] = [];
  selectedLabTests: IRadiology[] = [];
  selectedRadiology: IPhysiotherapy[] = [];
  selectedPhysiotherapy: ILabTest[] = [];
  selectedHospital: IHospital[] = [];
  @ViewChild('printBtn') printBtn: ElementRef<HTMLButtonElement>;
  @ViewChildren('medicinesListContainer')
  medicinesListContainer: QueryList<ElementRef>;
  medicinesListContainerLength: number = 3;
  unSelectedMedicineId: number;
  doctorName: string = '';
  patient: IPatient;
  prescriptionDate: Date;
  prescriptionId: number;
  headerInfo: RXHeaderInfo;
  patientInfo: RXPatientInfo;
  doctorInfo: RXDoctorInfo;
  topServices: TopUsedMedicalServices = {} as TopUsedMedicalServices;
  topmedicine: ITopMedicinesServices[] = [];
  topDiagnoses: ITopDiagnosesServices[] = [];
  topRadiologies: ITopServicesWithTypes[] = [];
  topLabTests: ITopServicesWithTypes[] = [];
  topPhysiotherapy: ITopServicesWithTypes[] = [];
  topHospital: ITopServicesWithTypes[] = [];
  selectedMedicinesRxcuis: string[] = [];
  isDoctorDiscardedInteraction: boolean = false;
  interactionNotificationDetails: IInteractionNotificationDTO;
  modalRef: BsModalRef;
  tempreatureDecimal: number = 0;
  oxygenDecimal: number = 0;
  heightDecimal: number = 0;
  weightDecimal: number = 0;
  keyUpSubjectDrug = new Subject<string>();
  keyUpSubjectDiagnoses = new Subject<string>();
  keyUpSubjectLabTests = new Subject<string>();
  keyUpSubjectRadiologies = new Subject<string>();
  keyUpSubjectPhysiotherapy = new Subject<string>();
  keyUpSubjectHospital = new Subject<string>();
  eventHolder: IDiagnose[] = [];
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private createEPrescriptionService: CreateEPrescriptionService,
    private homeService: HomeService,
    private toastr: ToastrService,
    private topMedicinesService: TopMedicinesService,
    private drugDrugInteractionService: DrugDrugInteractionService,
    private modalService: BsModalService,
    private appVersionsService: AppVersionsService
  ) {
    this.patientId = this.route.snapshot.params.patientId;
    this.patient = this.homeService.patientData;
    this.drugModel = new DrugModel();
    this.drugDosageCount = this.drugModel.drugDosageCount;
    this.drugFrequencyCount = this.drugModel.drugFrequencyCount;
    this.drugFrequencyPeriod = this.drugModel.drugFrequencyPeriod;
    this.drugPeriodCount = this.drugModel.drugPeriodCount;
    this.drugPeriodPeriod = this.drugModel.drugPeriodPeriod;
    this.drugDirectionList = this.drugModel.drugDirection;

    this.diagnosesTypeahead$.subscribe((searchTerm) => true);
    this.medicinesTypeahead$.subscribe((searchTerm) => true);
    this.labTestsTypeahead$.subscribe((searchTerm) => true);
    this.radiologyTypeahead$.subscribe((searchTerm) => true);
    this.physiotherapyTypeahead$.subscribe((searchTerm) => true);
    this.HospitalTypeahead$.subscribe((searchTerm) => true);

  }

  ngOnInit(): void {
    this.patient = this.homeService.patientData;
    if (!this.patient) {
      this.router.navigate(['home']);
    }
    this.prescriptionForm = this.formBuilder.group({
      diagnoses: [[], [Validators.required]],
      medicines: this.formBuilder.array([]),
      labFields: this.formBuilder.group(
        {
          labTests: [[]],
          radiology: [[]],
          physiotherapy: [[]],
          hospital: [[]],
        },
        { validator: this.labFieldsValidator }
      ),
      notes: [null],
      patient: [{}, Validators.required],
      vitals: [{}]
    });

    if (localStorage.getItem('isNotCreatePrescriptionAppVersion')) {
      localStorage.removeItem('isNotCreatePrescriptionAppVersion');
      localStorage.removeItem('appVersion');
    }

      this.topMedicinesService.getTopMedications().subscribe((response) => {
        this.diagnosesList = response.data.topUsedDiagnoses;
        this.topDiagnosesList = response.data.topUsedDiagnoses;
        this.medicinesList = response.data.topUsedMedications;
        this.topMedicinesList = response.data.topUsedMedications;
        this.labTestsList = response.data.topUsedLabTests;
        this.topLabTestsList = response.data.topUsedLabTests;
        this.radiologyList = response.data.topUsedRadiology;
        this.topRadiologyList = response.data.topUsedRadiology;
        this.physiotherapyList = response.data.topUsedPhysiotherapy;
        this.topPhysiotherapyList = response.data.topUsedPhysiotherapy;
        this.HospitalList = response.data.topUsedHospitalProcedures;
        this.topHospitalList = response.data.topUsedHospitalProcedures;
        this.onSearchDiagnoses();
        this.onSearchMedicinesList();
        this.onSearchLabTestsList();
        this.onSearchRadiologyList();
        this.onSearchPhysiotherapyList();
        this.onSearchHospitalList();
      })

    this.keyUpSubjectDiagnoses
      .pipe(debounceTime(500)) // Debounce the event stream by 500 milliseconds
      .subscribe((searchTerm: string) => {
        this.getDiagnosesBySearch(searchTerm, 'k');
      });
    this.keyUpSubjectDrug
      .pipe(debounceTime(500)) // Debounce the event stream by 500 milliseconds
      .subscribe((searchTerm: string) => {
        this.getDrugIndexBySearch(searchTerm, 'k');
      });
    this.keyUpSubjectLabTests
      .pipe(debounceTime(500)) // Debounce the event stream by 500 milliseconds
      .subscribe((searchTerm: string) => {
        this.getLabTestsBySearch(searchTerm, 'k');
      });
    this.keyUpSubjectRadiologies
      .pipe(debounceTime(500)) // Debounce the event stream by 500 milliseconds
      .subscribe((searchTerm: string) => {
        this.getRadiologyTestsBySearch(searchTerm, 'k');
      });
    this.keyUpSubjectPhysiotherapy
      .pipe(debounceTime(500)) // Debounce the event stream by 500 milliseconds
      .subscribe((searchTerm: string) => {
        this.getPhysiotherapiesBySearch(searchTerm, 'k');
      });
    this.keyUpSubjectHospital
      .pipe(debounceTime(500)) // Debounce the event stream by 500 milliseconds
      .subscribe((searchTerm: string) => {
        this.getHospitalsBySearch(searchTerm, 'k');
      });


    this.getTopMedications();

    this.medicines.push(this.newMedicine());
    this.medicines.push(this.newMedicine());
    this.medicines.push(this.newMedicine());

    const medicineInitialData = this.getMedicineInitialData();

    this.prescriptionForm.get('medicines').setValue(medicineInitialData);

    this.doctorName = localStorage.getItem('fullName');

    this.medicines.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((response) => {
        this.setMedicinesFormArrayValidation();

        if (this.medicines.controls.length > 1) {
          let validMedicineIndex = this.medicines.controls.findIndex(
            (medicineControl) => {
              return medicineControl.valid;
            }
          );

          if (validMedicineIndex != -1) {
            this.clearMedicinesFormArrayValidation(validMedicineIndex);
          } else {
            this.setMedicinesFormArrayValidation();
          }
        }
      });
  }

  onKeyUpDrugIndex(event: any): void {
    // Emit the input value to the Subject, triggering the debounce timer
    this.keyUpSubjectDrug.next(event.target.value);
  }
  onKeyUpDiagnoses(event: any): void {
    // Emit the input value to the Subject, triggering the debounce timer
    this.keyUpSubjectDiagnoses.next(event.target.value);
  }

  onKeyUpLabTests(event: any): void {
    // Emit the input value to the Subject, triggering the debounce timer
    this.keyUpSubjectLabTests.next(event.target.value);
  }

  onKeyUpRadiologies(event: any): void {
    // Emit the input value to the Subject, triggering the debounce timer
    this.keyUpSubjectRadiologies.next(event.target.value);
  }

  onKeyUpPhysiotherapy(event: any): void {
    // Emit the input value to the Subject, triggering the debounce timer
    this.keyUpSubjectPhysiotherapy.next(event.target.value);
  }

  onKeyUpHospital(event: any): void {
    // Emit the input value to the Subject, triggering the debounce timer
    this.keyUpSubjectHospital.next(event.target.value);
  }

  ngAfterViewInit(): void {
    this.medicinesListContainer.changes.subscribe((response) => {
      if (response.length > this.medicinesListContainerLength) {
        this.medicinesListContainerLength = response.length;

        this.medicinesListContainer.last.nativeElement.scrollIntoView({
          behavior: 'smooth',
          inline: 'start',
          block: 'center',
        });
      } else {
        this.medicinesListContainerLength = response.length;
      }
    });
  }

  get testType() {
    return TestType;
  }

  get medicines(): FormArray {
    return this.prescriptionForm.get('medicines') as FormArray;
  }

  onSelectTopMedicine(topMedicineId) {
    this.addTopMedicine(topMedicineId);
  }

  setMedicinesFormArrayValidation() {
    this.medicines.controls.forEach((medicineFormGroup, index) => {
      medicineFormGroup.get('medicine').setValidators(Validators.required);
      medicineFormGroup
        .get('medicine')
        .updateValueAndValidity({ emitEvent: false });
    });
  }

  clearMedicinesFormArrayValidation(validMedicineIndex) {
    this.medicines.controls.forEach((medicineFormGroup, index) => {
      if (validMedicineIndex != index) {
        medicineFormGroup.get('medicine').clearValidators();
        medicineFormGroup
          .get('medicine')
          .updateValueAndValidity({ emitEvent: false });
      }
    });
  }


  labFieldsValidator(control: AbstractControl): ValidationErrors | null {
    let labsValue = control.get('labTests').value;
    let radiologyValue = control.get('radiology').value;
    let physiotherapyValue = control.get('physiotherapy').value;
    let hospitalValue = control.get('hospital').value;

    if (
      labsValue?.length ||
      radiologyValue?.length ||
      physiotherapyValue?.length ||
      hospitalValue?.length


    ) {
      return null;
    }

    return { labFieldsError: true };
  }


  getDiagnosesBySearch(event, type: string) {

    if (event.length > 1) {
      this.createEPrescriptionService
        .getDiagnosesBySearch(event)
        .subscribe({
          next: (response: IResponse<IDiagnose[]>) => {
            this.diagnosesList = [...response.data, ...this.diagnosesList];
          },
          complete: () => {

            this.onSearchDiagnoses();
          }
        });
      if (type == 'c') {

        for (let i = 0; i < event.length; i++) {

          let isHere = this.topDiagnosesList.find(d => d.id == event[i].id)
          if (!isHere) {
            this.topDiagnosesList.push(event[i]);

          }
        }
      }
    }
    if (this.diagnosesList.length != this.topDiagnosesList.length) {

      for (let i = 0; i < event.length; i++) {

        let isHere = this.topDiagnosesList.find(d => d.id == event[i].id)
        if (!isHere) {
          this.topDiagnosesList.push(event[i]);

        }
      }
    }
    this.diagnosesList = this.topDiagnosesList;
    this.onSearchDiagnoses();

  }


  getDrugIndexBySearch(event, type: string) {

    if (event?.length > 1 || event.id) {
      this.createEPrescriptionService
        .getDrugIndexBySearch(event)
        .subscribe({
          next: (response: IResponse<IMedicine[]>) => {
            this.medicinesList = [...response.data, ...this.medicinesList];
          },
          complete: () => {

            this.onSearchMedicinesList();
          }
        });
      if (type == 'c') {
          let isHere = this.topMedicinesList.find(d => d.id == event.id)
          if (!isHere) {
            this.topMedicinesList.push(event);
          }
        
      }
    } else {
      this.medicinesList = this.topMedicinesList
      this.onSearchMedicinesList();
    }
    this.medicinesList = this.topMedicinesList;
    this.onSearchMedicinesList();
  }

  getLabTestsBySearch(event, type: string) {

    if (event.length > 1) {
      this.createEPrescriptionService
        .getLabTestsBySearch(event)
        .subscribe({
          next: (response: IResponse<ILabTest[]>) => {

            this.labTestsList = [...response.data, ...this.labTestsList];
          },
          complete: () => {
            this.onSearchLabTestsList();
          }
        });
      if (type == 'c') {

        for (let i = 0; i < event.length; i++) {

          let isHere = this.topLabTestsList.find(d => d.id == event[i].id)
          if (!isHere) {
            this.topLabTestsList.push(event[i]);
          }
        }
      }
    }
    if (this.labTestsList.length != this.topLabTestsList.length) {
      for (let i = 0; i < event.length; i++) {

        let isHere = this.topLabTestsList.find(d => d.id == event[i].id)
        if (!isHere) {
          this.topLabTestsList.push(event[i]);
        }
      }

    }
    this.labTestsList = this.topLabTestsList;
    this.onSearchLabTestsList();

  }
  getRadiologyTestsBySearch(event, type: string) {

    if (event.length > 1) {
      this.createEPrescriptionService
        .getRadiologyTestsBySearch(event)
        .subscribe({
          next: (response: IResponse<IRadiology[]>) => {

            this.radiologyList = [...response.data, ...this.radiologyList];
          },
          complete: () => {
            this.onSearchRadiologyList();
          }
        });
      if (type == 'c') {

        for (let i = 0; i < event.length; i++) {

          let isHere = this.topRadiologyList.find(d => d.id == event[i].id)
          if (!isHere) {
            this.topRadiologyList.push(event[i]);
          }
        }
      }
    }

    if (this.radiologyList.length != this.topRadiologyList.length) {
      for (let i = 0; i < event.length; i++) {

        let isHere = this.topRadiologyList.find(d => d.id == event[i].id)
        if (!isHere) {
          this.topRadiologyList.push(event[i]);
        }
      }
    }
    this.radiologyList = this.topRadiologyList;
    this.onSearchRadiologyList();

  }

  getPhysiotherapiesBySearch(event, type: string) {

    if (event.length > 1) {
      this.createEPrescriptionService
        .getPhysiotherapiesBySearch(event)
        .subscribe({
          next: (response: IResponse<IPhysiotherapy[]>) => {

            this.physiotherapyList = [...response.data, ...this.physiotherapyList];
          },
          complete: () => {
            this.onSearchPhysiotherapyList();
          }
        });
      if (type == 'c') {

        for (let i = 0; i < event.length; i++) {

          let isHere = this.topPhysiotherapyList.find(d => d.id == event[i].id)
          if (!isHere) {
            this.topPhysiotherapyList.push(event[i]);
          }
        }
      }
    }
    if (this.physiotherapyList.length != this.topPhysiotherapyList.length) {
      for (let i = 0; i < event.length; i++) {

        let isHere = this.topPhysiotherapyList.find(d => d.id == event[i].id)
        if (!isHere) {
          this.topPhysiotherapyList.push(event[i]);
        }
      }
    }
    this.physiotherapyList = this.topPhysiotherapyList;
    this.onSearchPhysiotherapyList();

  }

  getHospitalsBySearch(event, type: string) {

    if (event.length > 1) {
      this.createEPrescriptionService
        .getHospitalsBySearch(event)
        .subscribe({
          next: (response: IResponse<IHospital[]>) => {

            this.HospitalList = [...response.data, ...this.HospitalList];
          },
          complete: () => {
            this.onSearchHospitalList();
          }
        });
      if (type == 'c') {

        for (let i = 0; i < event.length; i++) {

          let isHere = this.topHospitalList.find(d => d.id == event[i].id)
          if (!isHere) {
            this.topHospitalList.push(event[i]);
          }
        }
      }
    }
    if (this.HospitalList.length != this.topHospitalList.length) {
      for (let i = 0; i < event.length; i++) {

        let isHere = this.topHospitalList.find(d => d.id == event[i].id)
        if (!isHere) {
          this.topHospitalList.push(event[i]);
        }
      }
    }
    this.HospitalList = this.topHospitalList;
    this.onSearchHospitalList();

  }



  // old will remove
  // getLabTests(currentAppVersion, savedAppVersion) {
  //   if (!!localStorage.getItem('labTestsList')
  //     && compareVersions(currentAppVersion, savedAppVersion || '0.0.0') <= 0) {
  //     this.labTestsList = JSON.parse(localStorage.getItem('labTestsList'));
  //     this.onSearchLabTestsList();
  //   } else {
  //     this.createEPrescriptionService.getLabTests().subscribe((response) => {
  //       this.labTestsList = response.data.tests;
  //       localStorage.setItem('labTestsList', JSON.stringify(this.labTestsList));
  //       this.onSearchLabTestsList();
  //     });
  //   }
  // }
  // // old will remove
  // getRadiology(currentAppVersion, savedAppVersion) {
  //   if (!!localStorage.getItem('radiologyList')
  //     && compareVersions(currentAppVersion, savedAppVersion || '0.0.0') <= 0) {
  //     this.radiologyList = JSON.parse(localStorage.getItem('radiologyList'));
  //     this.onSearchRadiologyList();
  //   } else {
  //     this.createEPrescriptionService.getRadiology().subscribe((response) => {
  //       this.radiologyList = response.data.tests;
  //       localStorage.setItem(
  //         'radiologyList',
  //         JSON.stringify(this.radiologyList)
  //       );
  //       this.onSearchRadiologyList();
  //     });
  //   }
  // }
  // // old will remove
  // getPhysiotherapy(currentAppVersion, savedAppVersion) {
  //   if (!!localStorage.getItem('physiotherapyList')
  //     && compareVersions(currentAppVersion, savedAppVersion || '0.0.0') <= 0) {
  //     this.physiotherapyList = JSON.parse(
  //       localStorage.getItem('physiotherapyList')
  //     );
  //     this.onSearchPhysiotherapyList();
  //   } else {
  //     this.createEPrescriptionService
  //       .getPhysiotherapy()
  //       .subscribe((response) => {
  //         this.physiotherapyList = response.data.tests;
  //         localStorage.setItem(
  //           'physiotherapyList',
  //           JSON.stringify(this.physiotherapyList)
  //         );
  //         this.onSearchPhysiotherapyList();
  //       });
  //   }
  // }
  // // old will remove
  // getHospitals(currentAppVersion, savedAppVersion) {
  //   if (!!localStorage.getItem('HospitalList') && localStorage.getItem('HospitalList').length > 0
  //     && compareVersions(currentAppVersion, savedAppVersion || '0.0.0') <= 0) {
  //     this.HospitalList = JSON.parse(localStorage.getItem('HospitalList'));
  //     this.onSearchHospitalList();
  //   } else {
  //     this.createEPrescriptionService.getHospitals().subscribe((response) => {
  //       this.HospitalList = response?.data?.tests;
  //       localStorage.setItem(
  //         'HospitalList',
  //         JSON.stringify(this.HospitalList || [])
  //       );
  //       if (this.HospitalList)
  //         this.onSearchHospitalList();
  //     });
  //   }
  // }

  trackByFn(item) {
    return item.id;
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

  onSortDiagnosesList(list, searchKey, searchTerm) {
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
            .indexOf(searchTerm) > -1 ||
          filteredItem.code
            ?.replace(/[^a-zA-Z0-9 ]/g, '')
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

  onSearchDiagnoses() {
    this.diagnosesItems$ = concat(
      of([...this.diagnosesList]),
      this.diagnosesTypeahead$.pipe(
        distinctUntilChanged(),
        switchMap((searchTerm: string) => {
          this.filteredDiagnosesList = [...this.diagnosesList];

          if (searchTerm) {
            this.filteredDiagnosesList = this.onSortDiagnosesList(
              this.filteredDiagnosesList,
              'name',
              searchTerm
            );
          }

          return of(this.filteredDiagnosesList);
        })
      )
    );
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

  onSearchLabTestsList() {
    this.labTestsItems$ = concat(
      of([...this.labTestsList]),
      this.labTestsTypeahead$.pipe(
        distinctUntilChanged(),
        switchMap((searchTerm: string) => {
          this.filteredLabTestsList = [...this.labTestsList];

          if (searchTerm) {
            this.filteredLabTestsList = this.onSortList(
              this.filteredLabTestsList,
              'name',
              searchTerm
            );
          }

          return of(this.filteredLabTestsList);
        })
      )
    );
  }

  onSearchRadiologyList() {
    this.radiologyItems$ = concat(
      of([...this.radiologyList]),
      this.radiologyTypeahead$.pipe(
        distinctUntilChanged(),
        switchMap((searchTerm: string) => {
          this.filteredRadiologyList = [...this.radiologyList];

          if (searchTerm) {
            this.filteredRadiologyList = this.onSortList(
              this.filteredRadiologyList,
              'name',
              searchTerm
            );
          }

          return of(this.filteredRadiologyList);
        })
      )
    );
  }

  onSearchPhysiotherapyList() {
    this.physiotherapyItems$ = concat(
      of([...this.physiotherapyList]),
      this.physiotherapyTypeahead$.pipe(
        distinctUntilChanged(),
        switchMap((searchTerm: string) => {
          this.filteredPhysiotherapyList = [...this.physiotherapyList];

          if (searchTerm) {
            this.filteredPhysiotherapyList = this.onSortList(
              this.filteredPhysiotherapyList,
              'name',
              searchTerm
            );
          }

          return of(this.filteredPhysiotherapyList);
        })
      )
    );
  }

  onSearchHospitalList() {
    this.HospitalItems$ = concat(
      of([...this.HospitalList]),
      this.HospitalTypeahead$.pipe(
        distinctUntilChanged(),
        switchMap((searchTerm: string) => {
          this.filteredHospitalList = [...this.HospitalList];

          if (searchTerm) {
            this.filteredHospitalList = this.onSortList(
              this.filteredHospitalList,
              'name',
              searchTerm
            );
          }

          return of(this.filteredHospitalList);
        })
      )
    );
  }

  getMedicineInitialData() {
    const data = [
      {
        medicine: null,
        isChronic: false,
        drugFrequency: {
          count: this.drugFrequencyCount[0].value,
          period: this.drugFrequencyPeriod[0].value,
        },
        drugPeriod: {
          count: this.drugPeriodCount[0].value,
          period: this.drugPeriodPeriod[0].value,
        },
        drugDirection:
          this.drugDirectionList[this.drugDirectionList.length - 1].value,
        drugDosage: this.drugDosageCount[0].value
      },
      {
        medicine: null,
        isChronic: false,
        drugFrequency: {
          count: this.drugFrequencyCount[0].value,
          period: this.drugFrequencyPeriod[0].value,
        },
        drugPeriod: {
          count: this.drugPeriodCount[0].value,
          period: this.drugPeriodPeriod[0].value,
        },
        drugDirection:
          this.drugDirectionList[this.drugDirectionList.length - 1].value,
        drugDosage: this.drugDosageCount[0].value
      },
      {
        medicine: null,
        isChronic: false,
        drugFrequency: {
          count: this.drugFrequencyCount[0].value,
          period: this.drugFrequencyPeriod[0].value,
        },
        drugPeriod: {
          count: this.drugPeriodCount[0].value,
          period: this.drugPeriodPeriod[0].value,
        },
        drugDirection:
          this.drugDirectionList[this.drugDirectionList.length - 1].value,
        drugDosage: this.drugDosageCount[0].value
      },
    ];

    return data;
  }

  checkAddAnotherMedicineDisable() {
    let isMedicinesValid: boolean = false;

    for (const medicineFormGroup of this.medicines.controls) {
      if (medicineFormGroup.get('medicine').value == null) {
        isMedicinesValid = true;
        break;
      }
    }

    return isMedicinesValid;
  }

  newMedicine(medicineId = null): FormGroup {
    return this.formBuilder.group({
      medicine: [medicineId, [Validators.required]],
      isChronic: [false, [Validators.required]],
      drugFrequency: this.formBuilder.group({
        count: [this.drugFrequencyCount[0].value, [Validators.required]],
        period: [this.drugFrequencyPeriod[0].value, [Validators.required]],
      }),
      drugPeriod: this.formBuilder.group({
        count: [this.drugPeriodCount[0].value, [Validators.required]],
        period: [this.drugPeriodPeriod[0].value, [Validators.required]],
      }),
      drugDirection: [
        this.drugDirectionList[this.drugDirectionList.length - 1].value,
        [Validators.required],
      ],
      drugDosage: [this.drugDosageCount[0].value, [Validators.required]]
    });
  }

  newMedicineWithDetails(selectedMedicine: ITopMedicinesServices): FormGroup {
    return this.formBuilder.group({
      medicine: [selectedMedicine.id, [Validators.required]],
      isChronic: [false, [Validators.required]],
      drugFrequency: this.formBuilder.group({
        count: [selectedMedicine.topUsedDosage.frequency, [Validators.required]],
        period: [selectedMedicine.topUsedDosage.frequencyDuration, [Validators.required]],
      }),
      drugPeriod: this.formBuilder.group({
        count: [selectedMedicine.topUsedDosage.period, [Validators.required]],
        period: [selectedMedicine.topUsedDosage.periodDuration, [Validators.required]],
      }),
      drugDirection: [
        selectedMedicine.topUsedDosage.direction,
        [Validators.required],
      ],
      drugDosage: [selectedMedicine.topUsedDosage.dosage, [Validators.required]]
    });
  }


  addMedicine() {
    this.filteredMedicinesList = [...this.medicinesList];
    this.medicines.push(this.newMedicine());
  }

  addTopMedicine(medicineId) {
    this.filteredMedicinesList = [...this.medicinesList];

    let replacedMedicineIndex = this.medicines.value.findIndex((medicine) => {
      return medicine.medicine == null;

    });


    if (replacedMedicineIndex != -1) {
      this.medicines
        .at(replacedMedicineIndex)
        .get('medicine')
        .setValue(medicineId);
    } else {
      this.medicines.push(this.newMedicine(medicineId));
    }
  }

  removeMedicine(medicineIndex: number, medicineId = null) {
    this.medicines.removeAt(medicineIndex);
    this.unSelectedMedicineId = medicineId;


    let topmedicine = this.topmedicine.find(t => t.id == medicineId);
    if (topmedicine)
      topmedicine.isChecked = false;

    setTimeout(() => {
      this.unSelectedMedicineId = null
    }, 0);
  }

  removeTopLabTest(event) {
    let topLabTest = this.topLabTests.find(t => t.id == event.value.id);
    if (topLabTest)
      topLabTest.isChecked = false;
  }

  removetopDiagnoses(event) {
    let topDiagnoses = this.topDiagnoses.find(t => t.id == event.value.id);
    if (topDiagnoses)
      topDiagnoses.isChecked = false;
  }

  clearAllDiagnoses() {
    this.topDiagnoses.map(d => d.isChecked = false);
  }

  clearAllLabTests() {
    this.topLabTests.map(d => d.isChecked = false);
  }

  clearAllRadiologies() {
    this.topRadiologies.map(d => d.isChecked = false);
  }

  clearAllPhysiotherapy() {
    this.topPhysiotherapy.map(d => d.isChecked = false);
  }

  clearAllHospitals() {
    this.topHospital.map(d => d.isChecked = false);
  }

  removetopRadiologies(event) {
    let topRadiologies = this.topRadiologies.find(t => t.id == event.value.id);
    if (topRadiologies)
      topRadiologies.isChecked = false;
  }
  removetopPhysiotherapy(event) {
    let topPhysiotherapy = this.topPhysiotherapy.find(t => t.id == event.value.id);
    if (topPhysiotherapy)
      topPhysiotherapy.isChecked = false;
  }
  removetopHospital(event) {
    let topHospital = this.topHospital.find(t => t.id == event.value.id);
    if (topHospital)
      topHospital.isChecked = false;
  }
  checkSubmitDisable() {
    if (
      this.prescriptionForm.get('diagnoses').valid &&
      ((this.createPersonalPatientDataForm.controls.patientName.value?.trim().length > 1 && this.createPersonalPatientDataForm.controls.patientName.value?.trim().match(/^([a-zA-Z0-9](\s?[a-zA-Z0-9])*)+$|^([ئ0-9لإيءألآلاؤآا-ى](\.?\s?[ئ0-9لإيءألآلاؤآا-ى])*)+$/gi))
        || this.patient?.patient?.patientName?.length > 0) &&
      (this.prescriptionForm.get('medicines').valid ||
        this.prescriptionForm.get('labFields').valid)
    ) {
      return false;
    }

    return true;
  }

  createStringOfIds(arrayOfObjects) {
    if (arrayOfObjects) {
      return arrayOfObjects.map((item) => item.id).join(',');
    }

    return null;
  }

  createTestsTypeId(arrayOfIds) {
    if (arrayOfIds?.length) {
      let tests = this.labTestsList.filter((test) => {
        return arrayOfIds.find((selectedTest) => {
          return selectedTest === test.id;
        });
      });

      let testsTypeId = tests[0].testTypeId;

      for (let test of tests) {
        if (test.testTypeId != tests[0].testTypeId) {
          testsTypeId = this.testType.All;
          break;
        }
      }

      return testsTypeId;
    }

    return null;
  }

  concatArrays(...arrays) {
    return [].concat(...arrays.filter(Array.isArray));
  }

  createLabFieldsIds(labFieldsObject) {
    if (labFieldsObject) {
      let labTests = labFieldsObject?.labTests;
      let radiology = labFieldsObject?.radiology;
      let physiotherapy = labFieldsObject?.physiotherapy;
      let hospital = labFieldsObject?.hospital;

      return this.concatArrays(labTests, radiology, physiotherapy, hospital).join(',');
    }

    return null;
  }

  createTestsObject(labFieldsObject) {
    let labTests = labFieldsObject.labTests?.length
      ? labFieldsObject.labTests?.join(',')
      : null;
    let radiologies = labFieldsObject.radiology?.length
      ? labFieldsObject.radiology?.join(',')
      : null;
    let physiotherapies = labFieldsObject.physiotherapy?.length
      ? labFieldsObject.physiotherapy?.join(',')
      : null;
    let hospital = labFieldsObject.hospital?.length
      ? labFieldsObject.hospital?.join(',')
      : null;

    return {
      labTests,
      radiologies,
      physiotherapies,
      hospital
    };
  }

  generateSelectedDiagnoses() {
    this.selectedDiagnoses = this.diagnosesList.filter((item) => {
      return this.prescriptionForm.value.diagnoses.indexOf(item.id) !== -1;
    });
  }

  generateSelectedLabTests() {
    let labTestsIdsArray = this.prescriptionForm.value?.labFields?.labTests;

    if (labTestsIdsArray?.length) {
      this.selectedLabTests = this.labTestsList.filter((item) => {
        return labTestsIdsArray.indexOf(item.id) !== -1;
      });
    }
  }

  generateSelectedRadiology() {
    let radiologyIdsArray = this.prescriptionForm.value?.labFields?.radiology;

    if (radiologyIdsArray?.length) {
      this.selectedRadiology = this.radiologyList.filter((item) => {
        return radiologyIdsArray.indexOf(item.id) !== -1;
      });
    }
  }

  generateSelectedPhysiotherapy() {
    let physiotherapyIdsArray =
      this.prescriptionForm.value?.labFields?.physiotherapy;

    if (physiotherapyIdsArray?.length) {
      this.selectedPhysiotherapy = this.physiotherapyList.filter((item) => {
        return physiotherapyIdsArray.indexOf(item.id) !== -1;
      });
    }
  }
  generateSelectedHospital() {
    let hospitalIdsArray =
      this.prescriptionForm.value?.labFields?.hospital;

    if (hospitalIdsArray?.length) {
      this.selectedHospital = this.HospitalList.filter((item) => {
        return hospitalIdsArray.indexOf(item.id) !== -1;
      });
    }
  }

  generateSelectedMedicines() {
    if (this.prescriptionForm.value.medicines?.length) {
      this.selectedMedicines = [];
      for (let medicine of this.prescriptionForm.value.medicines) {
        if (
          medicine.medicine &&
          medicine.drugFrequency.count &&
          medicine.drugFrequency.period &&
          medicine.drugPeriod.count &&
          medicine.drugPeriod.period &&
          medicine.drugDirection &&
          medicine.drugDosage
        ) {
          let medicineItem = this.medicinesList.find(
            (item) => item.id === medicine.medicine
          );

          this.selectedMedicines.push({
            medicine: medicineItem,
            isChronic: medicine.isChronic,
            frequency: medicine.drugFrequency.count,
            frequencyDuration: medicine.drugFrequency.period,
            period: medicine.drugPeriod.count,
            PeriodDuration: getSingularPluralPeriod(medicine.drugPeriod.count, medicine.drugPeriod.period),
            direction:
              medicine.drugDirection == 'لا يوجد' ? '' : medicine.drugDirection,
            dosage: medicine.drugDosage
          });
        }
      }
    }
  }

  createMedicinesArray(arrayOfObjects) {
    let selectedMedicines = [];

    if (arrayOfObjects) {
      for (let medicine of arrayOfObjects) {
        if (
          medicine.medicine &&
          medicine.drugFrequency.count &&
          medicine.drugFrequency.period &&
          medicine.drugPeriod.count &&
          medicine.drugPeriod.period &&
          medicine.drugDirection &&
          medicine.drugDosage
        ) {
          selectedMedicines.push({
            medicineId: medicine.medicine,
            IsChronic: medicine.isChronic,
            frequency: medicine.drugFrequency.count,
            frequencyDuration: medicine.drugFrequency.period,
            period: medicine.drugPeriod.count,
            PeriodDuration: getSingularPluralPeriod(medicine.drugPeriod.count, medicine.drugPeriod.period),
            direction: medicine.drugDirection,
            dosage: medicine.drugDosage
          });
        }
      }

      return selectedMedicines.length ? selectedMedicines : null;
    }

    return null;
  }

  createAddPrescriptionRequestBody(formValue) {
    'use strict';
    if (this.bloodPressureBottom && this.bloodPressureTop) {
      this.createVitalsDataForm.controls.bloodPressure.patchValue(`${this.bloodPressureTop}/${this.bloodPressureBottom}`)
    }
    if (this.createVitalsDataForm.controls.temperature.value) {
      this.createVitalsDataForm.controls.temperature.patchValue(this.createVitalsDataForm.controls.temperature.value + (0.1 * this.tempreatureDecimal))
    }
    if (this.createVitalsDataForm.controls.oxygenSaturation.value) {
      this.createVitalsDataForm.controls.oxygenSaturation.patchValue(this.createVitalsDataForm.controls.oxygenSaturation.value + (0.1 * this.oxygenDecimal))
    }
    if (this.createVitalsDataForm.controls.height.value) {
      this.createVitalsDataForm.controls.height.patchValue(this.createVitalsDataForm.controls.height.value + (0.1 * this.heightDecimal))
    }
    if (this.createVitalsDataForm.controls.weight.value) {
      this.createVitalsDataForm.controls.weight.patchValue(this.createVitalsDataForm.controls.weight.value + (0.1 * this.weightDecimal))
    }

    let requestBody = {
      diagnosesIds: formValue.diagnoses.join(','),
      testsIds: this.createLabFieldsIds(formValue.labFields),
      testsTypeId: this.testType.All,
      medicines: this.createMedicinesArray(formValue.medicines),
      channelId: ChannelTypeEnum.portal,
      notes: formValue.notes,
      patient: this.createPersonalPatientDataForm.value,
      vitals: this.createVitalsDataForm.value

    };
    if (this.isDoctorDiscardedInteraction && this.interactionNotificationDetails) {
      requestBody["isDiscarded"] = this.isDoctorDiscardedInteraction;
      requestBody["description"] = this.interactionNotificationDetails.descriptions;
      requestBody["severity"] = this.interactionNotificationDetails.severities.length > 0 ?
        this.interactionNotificationDetails.severities[0] : "N/A";
    }

    return requestBody;
  }

  generateHeaderInfo() {
    this.headerInfo = {
      date: new Date()
    }
  }

  generatePatientInfo() {
    this.patientInfo = {
      patientName: this.patient?.patient?.patientName,
      patientId: this.patientId,
      prescriptionId: this.prescriptionId,
      memberId: this.patient?.patient?.memberId
    }
  }

  generateDoctorInfo() {
    this.doctorInfo = {
      doctorName: this.doctorName
    }
  }

  onSubmit() {
    if ((this.bloodPressureBottom && !this.bloodPressureTop) || (!this.bloodPressureBottom && this.bloodPressureTop)) {
      showNotification(
        'danger',
        `You have entered one of the blood pressure values.. Please enter the other value`,
        this.toastr
      );
      return
    }
    let requestBody = this.createAddPrescriptionRequestBody(
      this.prescriptionForm.value
    );

    this.selectedDiagnoses = [];
    this.selectedLabTests = [];
    this.selectedRadiology = [];
    this.selectedPhysiotherapy = [];
    this.selectedHospital = [];
    this.selectedMedicines = [];

    this.generateSelectedDiagnoses();
    this.generateSelectedLabTests();
    this.generateSelectedRadiology();
    this.generateSelectedPhysiotherapy();
    this.generateSelectedHospital();
    this.generateSelectedMedicines();
    this.generateHeaderInfo();
    this.generatePatientInfo();
    this.generateDoctorInfo();

    this.createEPrescriptionService.addPrescription(requestBody).subscribe(
      (response) => {
        if (response.data.flag) {
          showNotification(
            'success',
            `The electronic prescription has been added successfully`,
            this.toastr
          );

          if (this.isPrintSubscription) {
            this.printBtn.nativeElement.click();
            this.isPrintSubscription = false;
          }

          this.router.navigate(['home']);
        }
      },
      (error) => {
        this.isPrintSubscription = false;
      }
    );
  }

  onSubmitAndPrint() {
    this.isPrintSubscription = true;
    if (this.createPersonalPatientDataForm.controls.patientName.value)
      this.patient.patient.patientName = this.createPersonalPatientDataForm.controls.patientName.value;
    this.onSubmit();
  }

  getTopMedications() {

    this.topMedicinesService.getTopMedications().subscribe((response) => {
      this.topServices = response.data;

      this.topDiagnoses = this.topServices.topUsedDiagnoses;
      this.topDiagnoses.map(r => r.isChecked = false)

      this.topmedicine = this.topServices.topUsedMedications;
      this.topmedicine.map(r => r.isChecked = false)

      this.topRadiologies = this.topServices.topUsedRadiology;
      this.topRadiologies.map(r => r.isChecked = false)

      this.topLabTests = this.topServices.topUsedLabTests;
      this.topLabTests.map(r => r.isChecked = false)

      this.topPhysiotherapy = this.topServices.topUsedPhysiotherapy;
      this.topPhysiotherapy.map(r => r.isChecked = false)

      this.topHospital = this.topServices.topUsedHospitalProcedures;
      this.topHospital.map(r => r.isChecked = false)
    });
  }

  addToMedicineDosageList(medicineId) {
    let replacedMedicineIndex = this.medicines.value.findIndex((medicine) => {
      return medicine.medicine == null;
    });
    let selectedTopMedicine = this.topmedicine.find(m => m.id == medicineId);
    this.medicines.controls.forEach((medicineFormGroup, index) => {
      medicineFormGroup.get('medicine').setValidators(Validators.required);
      medicineFormGroup
        .get('medicine')
        .updateValueAndValidity({ emitEvent: false });
    })

    if (replacedMedicineIndex == -1) {
      this.medicines.push(this.newMedicineWithDetails(selectedTopMedicine));
      return;
    }

    let medicine = this.medicines.get(replacedMedicineIndex.toString()).get('medicine');
    medicine.patchValue(selectedTopMedicine.id);

    let medicine1 = this.medicines.get(replacedMedicineIndex.toString()).get('drugFrequency');
    medicine1.patchValue({
      count: selectedTopMedicine.topUsedDosage.frequency,
      period: selectedTopMedicine.topUsedDosage.frequencyDuration
    });
    let medicine2 = this.medicines.get(replacedMedicineIndex.toString()).get('drugPeriod');
    medicine2.patchValue({
      count: selectedTopMedicine.topUsedDosage.period,
      period: selectedTopMedicine.topUsedDosage.periodDuration
    });
    let medicine3 = this.medicines.get(replacedMedicineIndex.toString()).get('drugDirection');
    medicine3.patchValue(selectedTopMedicine.topUsedDosage.direction);
    let medicine4 = this.medicines.get(replacedMedicineIndex.toString()).get('drugDosage');
    medicine4.patchValue(selectedTopMedicine.topUsedDosage.dosage);
  }

  addToDiagnosesList(diagnosesId) {

    let diagnoses = this.prescriptionForm.get('diagnoses').value;
    diagnoses.push(diagnosesId);
    this.prescriptionForm.get('diagnoses').patchValue(diagnoses);
  }

  addToLabTestsList(LabTestsId) {
    let Labtests = this.prescriptionForm.get('labFields').get('labTests').value;
    Labtests.push(LabTestsId);
    this.prescriptionForm.get('labFields').get('labTests').patchValue(Labtests);
  }

  addToRadiologiesList(radiologyId) {
    let radiologies = this.prescriptionForm.get('labFields').get('radiology').value;
    radiologies.push(radiologyId);
    this.prescriptionForm.get('labFields').get('radiology').patchValue(radiologies);
  }

  addToPhysiotherapyList(physiotherapyId) {
    let physiotherapies = this.prescriptionForm.get('labFields').get('physiotherapy').value;
    physiotherapies.push(physiotherapyId);
    this.prescriptionForm.get('labFields').get('physiotherapy').patchValue(physiotherapies);
  }

  addToHospitalList(hospitalId) {
    let hospitals = this.prescriptionForm.get('labFields').get('hospital').value;
    hospitals.push(hospitalId);
    this.prescriptionForm.get('labFields').get('hospital').patchValue(hospitals);
  }

  checkDrugDrugInteractionAndSubmit(isPrintRequired: boolean) {
    this.prescriptionForm.controls.patient.patchValue(this.createPersonalPatientDataForm.value)
    this.prescriptionForm.controls.vitals.patchValue(this.createVitalsDataForm.value)
    let previousSelectedMedicines = [...this.selectedMedicines];
    this.selectedMedicinesRxcuis = [];
    this.generateSelectedMedicines();

    if (JSON.stringify(previousSelectedMedicines) == JSON.stringify(this.selectedMedicines)
      && this.interactionNotificationDetails?.descriptions?.length > 0 &&
      !this.isDoctorDiscardedInteraction) {
      this.openDrugsInteractionModal(isPrintRequired);
      return;
    }

    let selectedMedicinesWithGenericName = this.selectedMedicines.filter(m =>
      m.medicine.genericName);
    if (selectedMedicinesWithGenericName.length <= 1) {
      this.submitHandler(isPrintRequired);
      return;
    }

    let returnedRxcuis$: Observable<{ api: IDrugRxcuiResponse, genericName: string }> = merge(...selectedMedicinesWithGenericName
      .map(m => this.drugDrugInteractionService.getDrugRxcui(m.medicine.genericName)));

    returnedRxcuis$.subscribe({

      next: (res) => {
        let rxnavDrugGroup = res.api.drugGroup.conceptGroup?.find(c => c.tty == "SCD");
        let rxnavDrug = (rxnavDrugGroup && rxnavDrugGroup.conceptProperties)
          ? rxnavDrugGroup.conceptProperties[0] : null;
        this.selectedMedicinesRxcuis.push(rxnavDrug?.rxcui);
        this.selectedMedicinesRxcuis = this.selectedMedicinesRxcuis.filter(m => m);
        // this.selectedMedicines.find(sm => sm.medicine.genericName == res.genericName)
        //   .medicine.rxnavGenericName = rxnavDrug?.name;
      },
      complete: () => {
        if (this.selectedMedicinesRxcuis.length <= 1) {
          setTimeout(() => {
            this.submitHandler(isPrintRequired);
          }, 0);
          return;
        }

        this.drugDrugInteractionService.getDrugDrugInteraction(this.selectedMedicinesRxcuis).subscribe(
          res => {
            if (res.fullInteractionTypeGroup && res.fullInteractionTypeGroup.length > 0
              && !this.isDoctorDiscardedInteraction) {
              this.interactionNotificationDetails = this.mapDrugInteractions(res);
              this.openDrugsInteractionModal(isPrintRequired);
            }
            else {
              this.submitHandler(isPrintRequired);
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
        // tradeName: this.selectedMedicines.find(sm => sm.medicine.rxnavGenericName
        //   && sm.medicine.rxnavGenericName.toLowerCase().includes(prop.toLowerCase()))?.medicine.name
      });
    }

    interactionDetails.medicines = mappedMedicines;
    interactionDetails.severities = [...new Set(interactionDetails.severities)]
      .filter(s => s != "N/A" && s != "NA");
    return interactionDetails as IInteractionNotificationDTO;
  }

  openDrugsInteractionModal(isPrintRequired) {
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

    this.modalRef.content.event.subscribe((response) => {
      this.isDoctorDiscardedInteraction = true;
      this.submitHandler(isPrintRequired);
    });
  }

  submitHandler(isPrintRequired) {
    isPrintRequired ? this.onSubmitAndPrint() : this.onSubmit();
  }

  focusOnNextInput(event: any, nextInput: HTMLInputElement, numberOfLength: number) {
    if (event.target.value.length === numberOfLength) {
      const input = nextInput.querySelector('input') as HTMLInputElement;
      input.focus();
    }
  }
}
