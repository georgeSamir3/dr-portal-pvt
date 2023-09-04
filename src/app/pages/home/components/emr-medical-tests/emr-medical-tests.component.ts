import { ChannelTypeEnum } from '@enums/home/channel-type.enum';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBreadcrumbItem } from '@interfaces/i-breadcrumb-item';
import { IPreviousMedicalTest } from '@interfaces/home/i-previous-medical-test';
import { IRecentMedicalTest } from '@interfaces/home/i-recent-medical-test';
import { EmrMedicalTestsService } from '@services/home/emr-medical-tests/emr-medical-tests.service';
import { showNotification } from '@helpers/show-toast';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { IPatientMedicalTest } from '@interfaces/Emr/i-patient-medical-tests';
import { FilterParams } from '@interfaces/Generic/i-filter-params';
import { IPreviousTest } from '@interfaces/Emr/i-previous-test';
import { IRecentTest } from '@interfaces/Emr/i-recent-test';

@Component({
  selector: 'emr-medical-tests',
  templateUrl: './emr-medical-tests.component.html',
  styleUrls: ['./emr-medical-tests.component.scss'],
})
export class EmrMedicalTestsComponent implements OnInit {
  pageTitle: string = 'EHR Medical Tests';
  breadcrumbList: IBreadcrumbItem[] = [{ text: 'EHR Medical Tests', link: '' }];
  patientId: string = '';
  recentTests: IRecentMedicalTest[] = [];
  previousTests: IPreviousMedicalTest[] = [];
  recentTestRequests: IRecentTest[] = [];
  previousTestRequests: IPreviousTest[] = [];

  recentMedicalTests: IPatientMedicalTest[] = [];
  completedMedicalTests: IPatientMedicalTest[] = [];
  modifiedRecentMedicalTests: any[] = [];
  modifiedCompletedMedicalTests: any[] = [];

  recentTestsThead: string[];
  previousRequestsThead: string[];
  searchParams: FilterParams = {
    currentPage: 1,
    pageSize: 10,
  };
  loading = false;
  totalPages:number;
  modalRef: BsModalRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private emrMedicalTestsService: EmrMedicalTestsService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
  ) {
    this.patientId = this.route.snapshot.params.patientId;
  }

  ngOnInit(): void {
    this.getPatientRecentMedicalTests(this.patientId, this.searchParams.currentPage, this.searchParams.pageSize);
    this.getPatientCompletedMedicalTests(this.patientId, this.searchParams.currentPage, this.searchParams.pageSize);
  }

  getChannelType(channelId) {
    if (channelId == ChannelTypeEnum.application) return 'Application';
    else if (channelId == ChannelTypeEnum.admin) return 'Admin';
    else if (channelId == ChannelTypeEnum.portal) return 'Portal';
    return '--';
  }

  downloadFile(fileUrl) {
    this.emrMedicalTestsService.downloadFile(fileUrl, (response) => {
      let fileName = fileUrl.split('/').pop();
      let a = document.createElement('a');
      let objectUrl = URL.createObjectURL(response);
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  downloadTestRequestResults(event) {
    event.event.stopPropagation();
    let testResults = event.rowData.attachmentUrls;

    if (testResults?.length) {
      testResults.forEach((resultUrl) => {
        this.downloadFile(resultUrl.path);
      });
    } else {
      showNotification(
        'danger',
        'There is no results to download!',
        this.toastr
      );
    }
  }

  onTestClick(testId) {
    this.router.navigate([
      'patient-emr',
      this.patientId,
      'medical-tests',
      testId,
    ]);
  }

  getPatientRecentMedicalTests(patientId:string, currentPage: number, pageSize: number, scroll = false){
    this.loading = true;
    this.spinner.show();
    this.emrMedicalTestsService.getPatientRecentMedicalTests(patientId, currentPage, pageSize)
    .subscribe(res => {
      this.recentMedicalTests = scroll ? [...this.recentMedicalTests.concat(res.data.items)] : res.data.items;
      this.loading = false;
      this.modifiedRecentMedicalTests = this.modifyRecentMedicalTestsMapper(this.recentMedicalTests);
      this.totalPages = res.data.pagination.totalPages;
      this.searchParams.currentPage = res.data.pagination.currentPage;
      this.spinner.hide();
    });
  }

  getPatientCompletedMedicalTests(patientId:string, currentPage: number, pageSize: number, scroll= false){
    this.loading = true;
    this.spinner.show();
    this.emrMedicalTestsService.getPatientCompletedMedicalTests(patientId, currentPage, pageSize)
    .subscribe(res => {
      this.completedMedicalTests = scroll ? [...this.completedMedicalTests.concat(res.data.items)] : res.data.items;
      this.loading = false;
      this.modifiedCompletedMedicalTests = this.modifyCompletedMedicalTestsMapper(this.completedMedicalTests);
      this.totalPages = res.data.pagination.totalPages;
      this.searchParams.currentPage = res.data.pagination.currentPage;
      this.spinner.hide();
    });
  }

  modifyRecentMedicalTestsMapper(medicalTests: IPatientMedicalTest[]){
    this.recentTestsThead = ['Request Date', 'Channel', 'No. of Tests', 'Tests Name', 'Physiotherapy', 'Request Status'];
    
    return medicalTests.map(m => {
      return {
        id: m.id,
        channel: this.getChannelType(m.channelId),
        nooftests: m.testCount,
        testsname: m.testNames,
        physiotherapy: m.physiotherapyNames,
        requestdate: this.datePipe.transform(m.testDate, "MMM d, y, h:mm a"),
        requeststatus: 'Pending',
        sourcetype: m.sourceType
      }
    });
  }

  modifyCompletedMedicalTestsMapper(medicalTests: IPatientMedicalTest[]){
    this.previousRequestsThead = ['Request Date', 'Channel', 'No. of Tests', 'No. of Files', 'Tests Name', 'Physiotherapy'];
    
    return medicalTests.map(m => {
      return {
        id: m.id,
        channel: this.getChannelType(m.channelId),
        nooftests: m.testCount,
        nooffiles: m.attachmentUrls.length,
        testsname: m.testNames,
        physiotherapy: m.physiotherapyNames,
        requestdate: this.datePipe.transform(m.testDate, "MMM d, y, h:mm a"),
        attachmentUrls: m.attachmentUrls,
        typeids: m.typeIds,
        iseditable: m.isEditable,
        testdate: m.testDate,
        download: true,
        sourcetype: m.sourceType
      }
    });
  }

  onMedicalTestClick(medicalTest) {
    this.router.navigate(['patient-emr', this.patientId, 'medical-tests-details'], {
      queryParams: { medicalTestId: medicalTest.id, sourceType: medicalTest.sourcetype },
    });
  }

  onScrollDown(isRecent:boolean) {
    if (this.searchParams.currentPage < this.totalPages) {
      this.searchParams.currentPage++;
      if(isRecent)
        this.getPatientRecentMedicalTests(this.patientId, this.searchParams.currentPage, this.searchParams.pageSize, true);
      else
        this.getPatientCompletedMedicalTests(this.patientId, this.searchParams.currentPage, this.searchParams.pageSize, true);
    }
  }
}
