import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { showNotification } from 'src/app/_helpers/show-toast';
import { PrescriptionSourceTypeEnum } from 'src/app/_enums/home/prescription-source-type.enum';
import { PatientEmrDetailsService } from 'src/app/_services/home/patient-emr/patient-emr-details.service';

@Component({
  selector: 'app-emr-hospitalprocedure-details',
  templateUrl: './emr-hospitalprocedure-details.component.html',
  styleUrls: ['./emr-hospitalprocedure-details.component.scss']
})
export class EmrHospitalprocedureDetailsComponent implements OnInit {
  patientId: number;
  hospitalProcedureId: number;
  hospitalProcedureSourceType: number;
  hospitalProcedureFiles: string[] = [];
  hospitalProcedureFilesAsImages: string[] = [];
  hospitalProcedureFilesAsPDFs: string[] = [];


  constructor(
    private patientEmrDetailsService: PatientEmrDetailsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.patientId = +this.activatedRoute.snapshot.params.patientId;
    this.hospitalProcedureId = +this.activatedRoute.snapshot.params.hospitalProcedureId;
    this.hospitalProcedureSourceType =
      +this.activatedRoute.snapshot.params.prescriptionSourceType;

    if (
      this.hospitalProcedureSourceType == this.prescriptionSourceTypeEnum.files
    ) {
      this.getPatientEhrHospitalprocedureFiles(
        this.hospitalProcedureId,
        this.patientId
      );
    } else {
      showNotification(
        'danger',
        'Something went wrong with source type!',
        this.toastr
      );
    }
  }

  get prescriptionSourceTypeEnum() {
    return PrescriptionSourceTypeEnum;
  }

  getPatientEhrHospitalprocedureFiles(hospitalProcedureId, patientId){
    this.patientEmrDetailsService
      .getPatientEhrHospitalprocedureFiles(hospitalProcedureId, patientId)
      .subscribe(
        (response) => {
          this.hospitalProcedureFiles = response.data?.attachmentUrls;

          if (this.hospitalProcedureFiles?.length) {
            this.hospitalProcedureFiles.forEach((file) => {
              if (this.checkFileType(file)) {
                this.hospitalProcedureFilesAsPDFs.push(file);
              } else {
                this.hospitalProcedureFilesAsImages.push(file);
              }
            });
          }
        },
        (error) => {
          showNotification(
            'danger',
            `${
              error.error
                ? error?.error?.errorList[0]?.message
                : error?.errors?.title
            }`,
            this.toastr
          );
        }
      );
  }

  checkFileType(src) {
    const pattern = /.+.pdf$/;
    return pattern.test(src);
  }

  downloadFile(fileUrl) {
    this.patientEmrDetailsService.downloadFile(fileUrl).subscribe( (response) => {
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



}
