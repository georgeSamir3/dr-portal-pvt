import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, UntypedFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { IBreadcrumbItem } from '@interfaces/i-breadcrumb-item';
import { GliptusPmsService } from '@services/gliptus-pms/gliptus-pms.service';
import { PatientData, VisitData, VisitsCount } from '@models/gliptus-pms/gliptus-pms';
import { ToastrService } from 'ngx-toastr';
import { showNotification } from '@helpers/show-toast';
import { Chart } from 'chart.js';
import 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-gliptus-pms',
  templateUrl: './gliptus-pms.component.html',
  styleUrls: ['./gliptus-pms.component.scss']
})
export class GliptusPmsComponent implements OnInit, AfterViewInit {
  pageTitle: string = 'Gliptus Pms';
  breadcrumbList: IBreadcrumbItem[] = [{ text: 'Gliptus Pms', link: '' }];
  mobileNumber: string;
  patientData: PatientData;
  patientForm: FormGroup;
  visitForm: FormGroup;
  visits: VisitData[] = [];
  currentVisit: number = 1;
  visitsCount: VisitsCount;
  chart: any;
  @ViewChild('bloodGlucoseErrorTemplate', { static: false }) bloodGlucoseErrorTemplate: TemplateRef<any>;
  typeId = 0;

  constructor(
    private gliptusPmsService: GliptusPmsService,

    //up to 16 from private fb: FormBuilder, to  private fb: UntypedFormBuilder,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.initCreatePatientForm(null);
    this.initVisitsForm();
  }

  ngAfterViewInit(): void {
    this.getVisitsCountStatistics()
  }

  getVisitsCountStatistics() {
    this.gliptusPmsService.getVisitsCount().subscribe((res) => {
      this.visitsCount = res.data;
      let htmlRef = this.elementRef.nativeElement.querySelector(`#canvas`);
      this.chart = new Chart(htmlRef, {
        type: 'doughnut',
        data: {
          labels: ['First Visit', 'Second Visit', 'Third visit'],
          datasets: [
            {
              label: 'My First Dataset',
              data: [
                this.visitsCount?.firstVisits,
                this.visitsCount?.secondVisits,
                this.visitsCount?.thirdVisits,
              ],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
              ],
              hoverOffset: 4,
              minBarLength: 7
            },
          ],
        },
        options: {
          plugins: {
            datalabels: {
              // display: true,
              color: '#fff',
              font: {
                size: 14,
                weight: 'bold'
              },
              formatter: (value, ctx) => {
                let label = ctx.chart.data.labels[ctx.dataIndex];
                return label + ': ' + value;
              },
              display: function (context) {
                return context.dataset.data[context.dataIndex] !== 0;
              }
            }
          },
          borderRadius: 10,
          tooltips: false, // remove tooltips on hover
        }
      });
    })
  }

  submitDoctorNumber(mobileNumber: string) {
    this.gliptusPmsService.getPatientGliptusData(mobileNumber)
      .subscribe(
        res => {
          const { data } = res;
          this.patientData = data;
          this.visits = data.visits;
          this.mobileNumber = '';
          this.initCreatePatientForm(data.initialData);
          if (data.initialData.fullName !== null) {
            this.patientForm.disable();
          }
          if (data.visits) {
            this.initVisitsForm();
          }
        },
      );
  }

  onPatientSelected(phone: string) {
    this.submitDoctorNumber(phone);
  }

  initCreatePatientForm(initialData: any) {
    this.patientForm = this.fb.group({
      fullName: [initialData?.fullName || '', Validators.required],
      phone: [initialData?.phone || '', Validators.required],
      nationalId: [initialData?.nationalId || ''],
      dateOfBirth: [this.formatDate(initialData?.dateOfBirth), Validators.required],
      gender: [initialData?.gender || '', Validators.required],
      isPregnant: [initialData?.isPregnant.toString() || '0'],
      dateOfDiagnosis: [initialData?.dateOfDiagnosis ? this.formatDate(initialData?.dateOfDiagnosis) : ''],
      familyHistoryOfDiabetes: [initialData?.familyHistoryOfDiabetes ? initialData?.familyHistoryOfDiabetes?.toString() : ''],
      hasChronicIllnesses: [initialData?.hasChronicIllnesses ? initialData?.hasChronicIllnesses.toString() : ''],
      chronicIllnessesSpecification: [initialData?.chronicIllnessesSpecification || ''],
      lipidTests: this.fb.group({
        isDone: [initialData?.lipidTests?.isDone.toString() || '0'],
        cholesterol: [{ value: initialData?.lipidTests?.cholesterol || '', disabled: !initialData?.lipidTests?.isDone }],
        hdl: [{ value: initialData?.lipidTests?.hdl || '', disabled: !initialData?.lipidTests?.isDone }],
        ldl: [{ value: initialData?.lipidTests?.ldl || '', disabled: !initialData?.lipidTests?.isDone }],
        triglycerides: [{ value: initialData?.lipidTests?.triglycerides || '', disabled: !initialData?.lipidTests?.isDone }]
      }),
      kidneyTests: this.fb.group({
        isDone: [initialData?.kidneyTests?.isDone.toString() || '0'],
        egfr: [{ value: initialData?.kidneyTests?.egfr || '', disabled: !initialData?.kidneyTests?.isDone }],
        bloodUreaNitrogen: [{ value: initialData?.kidneyTests?.bloodUreaNitrogen || '', disabled: !initialData?.kidneyTests?.isDone }],
        serumCreatinine: [{ value: initialData?.kidneyTests?.serumCreatinine || '', disabled: !initialData?.kidneyTests?.isDone }]
      })
    });
    this.checkIflipidTestsOrkidneyTestsIsDone();
  }

  checkIflipidTestsOrkidneyTestsIsDone() {
    this.patientForm.get('lipidTests.isDone').valueChanges.subscribe(value => {
      if (value === '0') {
        this.patientForm.get('lipidTests.cholesterol').disable();
        this.patientForm.get('lipidTests.hdl').disable();
        this.patientForm.get('lipidTests.ldl').disable();
        this.patientForm.get('lipidTests.triglycerides').disable();
        this.patientForm.get('lipidTests.cholesterol').clearValidators();
        this.patientForm.get('lipidTests.cholesterol').updateValueAndValidity();
      } else {
        this.patientForm.get('lipidTests.cholesterol').enable();
        this.patientForm.get('lipidTests.hdl').enable();
        this.patientForm.get('lipidTests.ldl').enable();
        this.patientForm.get('lipidTests.triglycerides').enable();
        this.patientForm.get('lipidTests.cholesterol').setValidators(Validators.required);
        this.patientForm.get('lipidTests.cholesterol').updateValueAndValidity();
      }
    });
    this.patientForm.get('kidneyTests.isDone').valueChanges.subscribe(value => {
      if (value === '0') {
        this.patientForm.get('kidneyTests.egfr').disable();
        this.patientForm.get('kidneyTests.bloodUreaNitrogen').disable();
        this.patientForm.get('kidneyTests.serumCreatinine').disable();
        this.patientForm.get('kidneyTests.egfr').clearValidators();
        this.patientForm.get('kidneyTests.egfr').updateValueAndValidity();
      } else {
        this.patientForm.get('kidneyTests.egfr').enable();
        this.patientForm.get('kidneyTests.bloodUreaNitrogen').enable();
        this.patientForm.get('kidneyTests.serumCreatinine').enable();
        this.patientForm.get('kidneyTests.egfr').setValidators(Validators.required);
        this.patientForm.get('kidneyTests.egfr').updateValueAndValidity();
      }
    });
  }

  initVisitsForm() {
    // Determine the current visit based on the number of visits returned
    this.currentVisit = this.visits.length + 1;

    const sharedControls = ['visitDate', 'laboratoryTestsResultsDate'];

    this.visitForm = this.fb.group({
      visitOne: this.createVisitFormGroup(1),
      visitTwo: this.createVisitFormGroup(2),
      visitThree: this.createVisitFormGroup(3)
    });

    if (this.currentVisit === 1) {
      // Remove Visist Two And Three
      this.visitForm.removeControl('visitTwo');
      this.visitForm.removeControl('visitThree');

      // Add validations for visitOne if the current visit is one
      const visitOneForm: any = this.visitForm.get('visitOne');
      const requiredValidators = Validators.required;
      this.setValidators(visitOneForm, sharedControls, [requiredValidators]);
    }

    if (this.currentVisit === 2) {
      // Remove Visit Three if the current visit is two
      this.visitForm.removeControl('visitThree');

      // Add validations for visitTwo if the current visit is two
      const visitTwoForm: any = this.visitForm.get('visitTwo');
      const requiredValidators = Validators.required;
      this.setValidators(visitTwoForm, sharedControls, [requiredValidators]);
    }

    if (this.currentVisit === 3) {
      // Add validations for visitThree if the current visit is three
      const visitThreeForm: any = this.visitForm.get('visitThree');
      const requiredValidators = Validators.required;

      this.setValidators(visitThreeForm, sharedControls, [requiredValidators]);
    }

    // Patch form values from existing data
    if (this.visits.length >= 1) {
      this.patchVisitFormValue(0, 'visitOne')
    }
    if (this.visits.length >= 2) {
      this.patchVisitFormValue(1, 'visitTwo')
    }
    if (this.visits.length >= 3) {
      this.patchVisitFormValue(2, 'visitThree')
    }
  }

  bloodGlucoseValidator(control: AbstractControl): { [key: string]: any } | null {
    const hbAC = control.get('hbAC').value;
    const fpg = control.get('fpg').value;
    const ppg = control.get('ppg').value;

    if (hbAC || fpg || ppg) {
      return null; // Validation passed if at least one field has a value
    } else {
      return { bloodGlucoseError: true }; // Validation failed, return error message
    }
  }


  createVisitFormGroup(visitNumber: number): FormGroup {
    const formGroup = this.fb.group({
      visitDate: [this.formatDate('')],
      bloodPressure: ['', Validators.pattern(/^\d{2,3}\/(\d{2}|\d{3})$/)],
      hasDiabetesRelatedComplications: ['0'],
      diabetesRelatedComplicationsSpecification: [''],
      hasHospitalizedDiabetesComplications: ['0'],
      hospitalizedDiabetesComplicationsSpecification: [''],
      laboratoryTestsResultsDate: [this.formatDate(''), Validators.required],
      bloodGlucoseTests: this.fb.group({
        hbAC: [null],
        fpg: [null],
        ppg: [null]
      }, { validator: this.bloodGlucoseValidator }),
      medications: this.createMedicationsArray()
    });

    // add the additional fields only in visittwo and visitThree
    if (visitNumber !== 1) {
      formGroup.addControl('isMedicationsChanged', this.fb.control('0'));
      formGroup.addControl('reasonOfChanging', this.fb.control(''));
      formGroup.addControl('experiencedAdverseEvents', this.fb.control('0'));
      formGroup.addControl('experiencedAdverseEventsSpecification', this.fb.control(''));
      formGroup.addControl('experiencedSymptomaticHypoglycemicEvents', this.fb.control('0'));
      formGroup.addControl('experiencedSymptomaticHypoglycemicEventsSpecification', this.fb.group({
        date: [this.formatDate('')],
        duration: [''],
        bloodGlucoseLevel: [''],
        requiredExternalAssistance: ['0'],
        requiredVisitToEmergencyDepartment: ['0'],
        wasWithLossOfConsciousness: ['0'],
        wasWithSeizure: ['0'],
        irregularMeals: [false],
        excessivePhysicalActivity: [false],
        medication: [false],
        others: [false],
        othersTagInput: [[]],
        possibleCauses: this.fb.array([])
      }));
    }

    return formGroup;
  }

  patchVisitFormValue(visitIndex: number, visitFormName: string): void {
    const visit = this.visits[visitIndex];
    const visitControl = this.visitForm.get(visitFormName);
    this.patchMedications(visit?.medications, visitFormName);
    visitControl.patchValue({
      visitDate: this.formatDate(visit?.visitDate),
      bloodPressure: visit?.bloodPressure,
      hasDiabetesRelatedComplications: visit?.hasDiabetesRelatedComplications?.toString(),
      diabetesRelatedComplicationsSpecification: visit?.diabetesRelatedComplicationsSpecification,
      hasHospitalizedDiabetesComplications: visit?.hasHospitalizedDiabetesComplications?.toString(),
      hospitalizedDiabetesComplicationsSpecification: visit?.hospitalizedDiabetesComplicationsSpecification,
      laboratoryTestsResultsDate: this.formatDate(visit?.laboratoryTestsResultsDate),
      bloodGlucoseTests: {
        hbAC: visit?.bloodGlucoseTests?.hbAC,
        fpg: visit?.bloodGlucoseTests?.fpg,
        ppg: visit?.bloodGlucoseTests?.ppg
      },
    });
    // patch the additional fields only in visittwo and visitThree
    if (visitIndex !== 0) {
      visitControl.patchValue({
        isMedicationsChanged: visit?.isMedicationsChanged?.toString(),
        reasonOfChanging: visit?.reasonOfChanging,
        experiencedAdverseEvents: visit?.experiencedAdverseEvents?.toString(),
        experiencedAdverseEventsSpecification: visit?.experiencedAdverseEventsSpecification,
        experiencedSymptomaticHypoglycemicEvents: visit?.experiencedSymptomaticHypoglycemicEvents?.toString(),
        experiencedSymptomaticHypoglycemicEventsSpecification: {
          date: this.formatDate(visit?.experiencedSymptomaticHypoglycemicEventsSpecification?.date),
          duration: visit?.experiencedSymptomaticHypoglycemicEventsSpecification?.duration,
          bloodGlucoseLevel: visit?.experiencedSymptomaticHypoglycemicEventsSpecification?.bloodGlucoseLevel,
          requiredExternalAssistance: visit?.experiencedSymptomaticHypoglycemicEventsSpecification?.requiredExternalAssistance?.toString(),
          requiredVisitToEmergencyDepartment: visit?.experiencedSymptomaticHypoglycemicEventsSpecification?.requiredVisitToEmergencyDepartment?.toString(),
          wasWithLossOfConsciousness: visit?.experiencedSymptomaticHypoglycemicEventsSpecification?.wasWithLossOfConsciousness?.toString(),
          wasWithSeizure: visit?.experiencedSymptomaticHypoglycemicEventsSpecification?.wasWithSeizure?.toString(),
          possibleCauses: visit?.experiencedSymptomaticHypoglycemicEventsSpecification?.possibleCauses
        },
      });
      visit?.experiencedSymptomaticHypoglycemicEventsSpecification?.possibleCauses.forEach((el) => {
        if (el == 'irregular meals') {
          visitControl.get('experiencedSymptomaticHypoglycemicEventsSpecification').get('irregularMeals').patchValue(true)
        } else if (el == 'excessive physical activity') {
          visitControl.get('experiencedSymptomaticHypoglycemicEventsSpecification').get('excessivePhysicalActivity').patchValue(true)
        } else if (el == 'medication') {
          visitControl.get('experiencedSymptomaticHypoglycemicEventsSpecification').get('medication').patchValue(true)
        } else {
          const currentValues = visitControl.get('experiencedSymptomaticHypoglycemicEventsSpecification').get('othersTagInput').value;
          const newValues = [...currentValues, el];
          visitControl.get('experiencedSymptomaticHypoglycemicEventsSpecification').get('others').patchValue(true)
          visitControl.get('experiencedSymptomaticHypoglycemicEventsSpecification').get('othersTagInput').patchValue(newValues);
        }
      })
    }
    visitControl.disable(); // disable form controls if data is present
  }


  setValidators(form: FormGroup, controls: string[], validators: ValidatorFn[]) {
    controls.forEach(controlName => {
      const control = form.get(controlName);
      if (control) {
        control.setValidators(validators);
        control.updateValueAndValidity();
      }
    });
  }

  patchMedications(medications: any[], visitName: string) {
    const medicationsArray = this.visitForm.get(`${visitName}.medications`) as FormArray;
    if (medications) {
      medications.forEach((medication) => {
        const index = medicationsArray.controls.findIndex(control => {
          if (medication.isOthers === 1 && medication.name) {
            return control.get('title').value === 'Other';
          } else {
            return control.get('title').value === medication.name;
          }
        });
        if (index >= 0) {
          const medicationGroup = medicationsArray.controls[index] as FormGroup;
          medicationGroup.patchValue({
            type: medication?.type,
            name: medication?.name,
            classDrug: medication?.classDrug,
            dose: medication?.dose,
            frequency: medication?.frequency,
            startDate: this.formatDate(medication?.startDate),
            endDate: this.formatDate(medication?.endDate),
            onGoing: medication?.onGoing,
            isOthers: medication.isOthers?.toString(),
            selected: true
          });
        } else {
          medication = {
            ...medication,
            title: '',
            startDate: this.formatDate(medication.startDate),
            endDate: this.formatDate(medication.endDate),
            selected: true
          }
          const newMedicationGroup = this.createMedicationFormGroup(medication);
          medicationsArray.push(newMedicationGroup);
        }
      });
    }
    medicationsArray.removeAt(15) // not show default medication of type 4 object when i patch
  }

  createMedicationFormGroup(medication: any): FormGroup {
    const formGroup = this.fb.group({
      title: [medication.title],
      type: [medication.type],
      name: [medication.name],
      classDrug: [medication.classDrug],
      dose: [medication.dose],
      frequency: [medication.frequency],
      startDate: [medication.startDate],
      endDate: [medication.endDate],
      onGoing: [medication.onGoing],
      isOthers: [medication.isOthers],
      selected: [medication.selected]
    });

    formGroup.get('selected').valueChanges.subscribe((selected: boolean) => {
      if (selected) {
        formGroup.get('dose').setValidators([Validators.required]);
      } else {
        formGroup.get('dose').clearValidators();
      }

      if (selected && (medication.type === 1 || medication.type === 2 || medication.type === 4)) {
        formGroup.get('frequency').setValidators([Validators.required]);
      } else {
        formGroup.get('frequency').clearValidators();
      }

      if (selected && medication.type === 4) {
        formGroup.get('name').setValidators([Validators.required]);
        formGroup.get('classDrug').setValidators([Validators.required]);
      } else {
        formGroup.get('name').clearValidators();
        formGroup.get('classDrug').clearValidators();
      }
      // update the validation status of the form controls
      formGroup.get('name').updateValueAndValidity();
      formGroup.get('classDrug').updateValueAndValidity();
      formGroup.get('dose').updateValueAndValidity();
      formGroup.get('frequency').updateValueAndValidity();
    });

    return formGroup;
  }


  createMedicationsArray(): FormArray {
    const medications = [
      { type: 1, name: 'Vildagliptin', title: 'Vildagliptin', classDrug: '', dose: '', frequency: '', startDate: this.formatDate(''), endDate: '', onGoing: false, isOthers: '0', selected: false },
      { type: 1, name: 'Vildagliptin/Metformin', title: 'Vildagliptin/Metformin', classDrug: '', dose: '', frequency: '', startDate: this.formatDate(''), endDate: '', onGoing: false, isOthers: '0', selected: false },
      { type: 2, name: 'Metformin', title: 'Metformin', classDrug: '', dose: '', frequency: '', startDate: this.formatDate(''), endDate: this.formatDate(''), onGoing: false, isOthers: '0', selected: false },
      { type: 2, name: 'Metformin XR', title: 'Metformin XR', classDrug: '', dose: '', frequency: '', startDate: this.formatDate(''), endDate: this.formatDate(''), onGoing: false, isOthers: '0', selected: false },
      { type: 2, name: 'Sulfonylureas', title: 'Sulfonylureas', classDrug: '', dose: '', frequency: '', startDate: this.formatDate(''), endDate: this.formatDate(''), onGoing: false, isOthers: '0', selected: false },
      { type: 2, name: 'Glinides', title: 'Glinides', classDrug: '', dose: '', frequency: '', startDate: this.formatDate(''), endDate: this.formatDate(''), onGoing: false, isOthers: '0', selected: false },
      { type: 2, name: 'Thiazolidinediones', title: 'Thiazolidinediones', classDrug: '', dose: '', frequency: '', startDate: this.formatDate(''), endDate: this.formatDate(''), onGoing: false, isOthers: '0', selected: false },
      { type: 2, name: 'GLP-1 receptor inhibitor', title: 'GLP-1 receptor inhibitor', classDrug: '', dose: '', frequency: '', startDate: this.formatDate(''), endDate: this.formatDate(''), onGoing: false, isOthers: '0', selected: false },
      { type: 2, name: 'SGLT2 inhibitors', title: 'SGLT2 inhibitors', classDrug: '', dose: '', frequency: '', startDate: this.formatDate(''), endDate: this.formatDate(''), onGoing: false, isOthers: '0', selected: false },
      { type: 2, name: '', dose: '', title: 'Other', classDrug: '', frequency: '', startDate: this.formatDate(''), endDate: this.formatDate(''), oonGoing: false, isOthers: '1', selected: false },
      { type: 3, name: 'Rapid-acting', title: 'Rapid-acting', classDrug: '', dose: '', frequency: '', startDate: this.formatDate(''), endDate: this.formatDate(''), onGoing: false, isOthers: '0', selected: false },
      { type: 3, name: 'Short acting', title: 'Short acting', classDrug: '', dose: '', frequency: '', startDate: this.formatDate(''), endDate: this.formatDate(''), onGoing: false, isOthers: '0', selected: false },
      { type: 3, name: 'Intermediate acting', title: 'Intermediate acting', classDrug: '', dose: '', frequency: '', startDate: this.formatDate(''), endDate: this.formatDate(''), onGoing: false, isOthers: '0', selected: false },
      { type: 3, name: 'Long acting', title: 'Long acting', classDrug: '', dose: '', frequency: '', startDate: this.formatDate(''), endDate: this.formatDate(''), onGoing: false, isOthers: '0', selected: false },
      { type: 3, name: 'Premixed Insulin', title: 'Premixed Insulin', classDrug: '', dose: '', frequency: '', startDate: this.formatDate(''), endDate: this.formatDate(''), onGoing: false, isOthers: '0', selected: false },
      { type: 4, name: '', title: '', classDrug: '', dose: '', frequency: '', startDate: this.formatDate(''), endDate: this.formatDate(''), onGoing: false, isOthers: '0', selected: false }
    ];

    const formGroups = medications.map(medication => this.createMedicationFormGroup(medication));
    return this.fb.array(formGroups);
  }

  addMedication() {
    const medication = { type: 4, name: '', title: '', classDrug: '', dose: '', frequency: '', startDate: this.formatDate(''), endDate: this.formatDate(''), onGoing: false, isOthers: '0', selected: false };
    const visitFormName = this.currentVisit === 1 ? 'visitOne' : this.currentVisit === 2 ? 'visitTwo' : 'visitThree';
    const medicationArr = this.visitForm.get(`${visitFormName}.medications`) as FormArray;
    medicationArr.push(this.createMedicationFormGroup(medication));
  }

  deleteMedication(index: number): void {
    const visitFormName = this.currentVisit === 1 ? 'visitOne' : this.currentVisit === 2 ? 'visitTwo' : 'visitThree';
    const medicationArr = this.visitForm.get(`${visitFormName}.medications`) as FormArray;
    medicationArr.removeAt(index);
  }

  onInputChange(visitKey: string) {
    const visitFormGroup = this.visitForm.get(visitKey) as FormGroup;
    const bloodPressureControl = visitFormGroup.get('bloodPressure');
    const value = bloodPressureControl.value;
    if (value !== null && value !== undefined && value !== '') {
      const match = /^\d{2,3}\/(\d{2}|\d{3})$/.exec(value);
      if (match) {
        const formattedValue = match[0];
        bloodPressureControl.setValue(formattedValue, { emitEvent: false });
        bloodPressureControl.setErrors(null);
      } else {
        bloodPressureControl.setErrors({ pattern: true });
      }
    } else {
      // bloodPressureControl.setErrors({ required: true });
    }
  }

  unsorted() { }

  private formatDate(dateString: string) {
    const date = dateString ? new Date(dateString) : new Date();
    return date;
  }

  private formatDateToIso(dateString: string): string {
    if (dateString) {
      const date = new Date(dateString);
      const isoString = date?.toISOString();
      return isoString.slice(0, -1); // remove last character ("Z")
    }
  }

  private scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.elementRef.nativeElement.querySelector(
      "form input.ng-invalid, form select.ng-invalid, .invalid"
    );

    window.scroll({
      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: "smooth"
    });
  }


  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }

  createRequest() {
    const patientFormData = this.patientForm.value;
    const visitFormData = this.visitForm.value;
    const visitData: any = Object.values(visitFormData).find(value => Object.keys(value).length > 0);
    let patientData: PatientData | { visitData: any } = { visitData: null };
    this.visitForm.markAllAsTouched();

    const possibleCauses = [];

    if (visitData.experiencedSymptomaticHypoglycemicEventsSpecification) {
      if (visitData.experiencedSymptomaticHypoglycemicEventsSpecification.irregularMeals) {
        possibleCauses.push('irregular meals');
      }

      if (visitData.experiencedSymptomaticHypoglycemicEventsSpecification.excessivePhysicalActivity) {
        possibleCauses.push('excessive physical activity');
      }

      if (visitData.experiencedSymptomaticHypoglycemicEventsSpecification.medication) {
        possibleCauses.push('medication');
      }

      if (visitData.experiencedSymptomaticHypoglycemicEventsSpecification.others) {
        visitData.experiencedSymptomaticHypoglycemicEventsSpecification.othersTagInput.forEach(element => {
          possibleCauses.push(element.label)
        });
      }
    }

    if (this.currentVisit == 1) {
      this.patientForm.markAllAsTouched();
      patientData = {
        initialData: {
          fullName: patientFormData?.fullName,
          phone: patientFormData?.phone,
          nationalID: patientFormData?.nationalId,
          dateOfBirth: this.formatDateToIso(patientFormData?.dateOfBirth),
          gender: patientFormData?.gender,
          isPregnant: parseInt(patientFormData?.isPregnant),
          dateOfDiagnosis: this.formatDateToIso(patientFormData?.dateOfDiagnosis),
          familyHistoryOfDiabetes: parseInt(patientFormData?.familyHistoryOfDiabetes),
          hasChronicIllnesses: parseInt(patientFormData?.hasChronicIllnesses),
          chronicIllnessesSpecification: patientFormData?.chronicIllnessesSpecification,
          lipidTests: {
            isDone: parseInt(patientFormData?.lipidTests?.isDone),
            cholesterol: patientFormData?.lipidTests?.cholesterol,
            hDL: patientFormData?.lipidTests?.hdl,
            lDL: patientFormData?.lipidTests?.ldl,
            triglycerides: parseInt(patientFormData?.lipidTests?.triglycerides),
          },
          kidneyTests: {
            isDone: parseInt(patientFormData?.kidneyTests?.isDone),
            eGFR: patientFormData?.kidneyTests?.egfr,
            bloodUreaNitrogen: patientFormData?.kidneyTests?.bloodUreaNitrogen,
            serumCreatinine: patientFormData?.kidneyTests?.serumCreatinine,
          },
        },
      };
    } else {
      patientData = {
        initialData: {
          phone: patientFormData?.phone,
        },
      };
    }

    patientData.visitData = {
      visitNumber: this.currentVisit,
      visitDate: this.formatDateToIso(visitData?.visitDate),
      bloodPressure: visitData?.bloodPressure,
      hasDiabetesRelatedComplications: parseInt(visitData?.hasDiabetesRelatedComplications),
      diabetesRelatedComplicationsSpecification: visitData?.diabetesRelatedComplicationsSpecification,
      hasHospitalizedDiabetesComplications: parseInt(visitData?.hasHospitalizedDiabetesComplications),
      hospitalizedDiabetesComplicationsSpecification: visitData?.hospitalizedDiabetesComplicationsSpecification,
      laboratoryTestsResultsDate: this.formatDateToIso(visitData?.laboratoryTestsResultsDate),
      bloodGlucoseTests: {
        hbAC: visitData?.bloodGlucoseTests.hbAC,
        fpg: visitData?.bloodGlucoseTests.fpg,
        ppg: visitData?.bloodGlucoseTests.ppg
      },
      medications: visitData?.medications
        ?.filter(medication => medication.selected)
        ?.map(({ selected, onGoing, startDate, endDate, isOthers, title, ...medication }) => ({
          ...medication,
          onGoing: onGoing ? 1 : 0,
          startDate: this.formatDateToIso(startDate),
          endDate: this.formatDateToIso(endDate),
          isOthers: parseInt(isOthers)
        })),
    }
    if (this.currentVisit !== 1) {
      patientData.visitData.isMedicationsChanged = parseInt(visitData?.isMedicationsChanged)
      patientData.visitData.reasonOfChanging = visitData?.reasonOfChanging
      patientData.visitData.experiencedAdverseEvents = parseInt(visitData?.experiencedAdverseEvents)
      patientData.visitData.experiencedAdverseEventsSpecification = visitData?.experiencedAdverseEventsSpecification
      patientData.visitData.experiencedSymptomaticHypoglycemicEvents = parseInt(visitData?.experiencedSymptomaticHypoglycemicEvents)
      patientData.visitData.experiencedSymptomaticHypoglycemicEventsSpecification = {
        date: this.formatDateToIso(visitData?.experiencedSymptomaticHypoglycemicEventsSpecification?.date),
        duration: visitData?.experiencedSymptomaticHypoglycemicEventsSpecification?.duration,
        bloodGlucoseLevel: visitData?.experiencedSymptomaticHypoglycemicEventsSpecification?.bloodGlucoseLevel,
        requiredExternalAssistance: parseInt(visitData?.experiencedSymptomaticHypoglycemicEventsSpecification?.requiredExternalAssistance),
        requiredVisitToEmergencyDepartment: parseInt(visitData?.experiencedSymptomaticHypoglycemicEventsSpecification?.requiredVisitToEmergencyDepartment),
        wasWithLossOfConsciousness: parseInt(visitData?.experiencedSymptomaticHypoglycemicEventsSpecification?.wasWithLossOfConsciousness),
        wasWithSeizure: parseInt(visitData?.experiencedSymptomaticHypoglycemicEventsSpecification?.wasWithSeizure),
        possibleCauses: possibleCauses
      };
    }

    (patientData.visitData.bloodGlucoseTests.hbAC == null) && delete patientData.visitData.bloodGlucoseTests.hbAC;
    (patientData.visitData.bloodGlucoseTests.fpg == null) && delete patientData.visitData.bloodGlucoseTests.fpg;
    (patientData.visitData.bloodGlucoseTests.ppg == null) && delete patientData.visitData.bloodGlucoseTests.ppg;


    if (this.visitForm.valid && (this.currentVisit == 1 ? this.patientForm.valid : true)) {
      this.gliptusPmsService.addPatientGliptus(patientData).subscribe((res) => {
        if (res.data.flag == true) {
          showNotification('success', 'Data submitted successfully!', this.toastr);
          setTimeout(() => {
            window.location.reload();
          }, 2000)
        }
      })
    } else {
      this.scrollToFirstInvalidControl();
      showNotification('danger', 'Data missed please fill all required fields!', this.toastr);
    }

  }

}
