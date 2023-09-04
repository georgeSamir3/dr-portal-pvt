import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ViewEncapsulation,
  OnInit,
  ChangeDetectorRef,
  Injectable,
  ElementRef
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventTitleFormatter,
  CalendarViewPeriod,
  CalendarWeekViewBeforeRenderEvent,
} from 'angular-calendar';
import { WeekViewHourColumn, WeekViewHourSegment } from 'calendar-utils';
import { DatePipe } from '@angular/common';
import { AppointmentsInRangeService } from '@services/Appointments/AppointmentsInRange.service';
import { ActivatedRoute} from '@angular/router';
import { IAppointmentsInRange, IDaysOff, IPatientDetails, IWorkingHours} from '@interfaces/Appointments/i-appointments-inRange';
import { timeToDecimal } from 'src/app/helpers/convert-time-decimal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddNewPatientAndReserveRequest, IReserveAppointments } from '@interfaces/Appointments/i-reserve-appointments';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DaysOffComponent } from '../appointments-settings/days-off/days-off/days-off.component';
import { WeekDays } from 'src/app/_constants/weekdays';
import { AppointmentSettingsService } from '@services/Appointments/appointments-settings/appointment-settings.service';
import { ConsultaionDurationModalComponent } from '../appointments-settings/consultation-duration/consultaion-Duration-modal/consultaion-Duration-modal.component';
import { IConsulationDuration} from '@interfaces/Appointments/appointments-settings/i-appointments-settings';
import { HourSegment } from 'src/app/_constants/hoursegment';
import { WorkingHoursModalComponent } from '../appointments-settings/working-hours/working-hours-modal/working-hours-modal.component';
import { HomeService } from '@services/home/home.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { showNotification } from '@helpers/show-toast';
import { ToastrService } from 'ngx-toastr';
import { ReserveAppointmentModalComponent } from '../reserve-appointment-modal/reserve-appointment-modal.component';

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  weekTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.weekTooltip(event, title);
    }
  }

  dayTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.dayTooltip(event, title);
    }
  }
}

@Component({
  selector: 'appointments-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './appointments-calendar.component.html',
  styles: [
    `
    .disable-hover {
      pointer-events: none;
    }
  `,
  ],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],

  encapsulation: ViewEncapsulation.None,
})


export class AppointmentsCalendarComponent implements OnInit {
  isViewPatientEmr: boolean = false;
  CurrentstartDateTime:string;
  ErrorMessage:any[]=[];
  @ViewChild('modalContent1', { static: true }) modalContent1: TemplateRef<any>;
  @ViewChild('mwl-calendar-week-view') weeklyCalender: ElementRef;

  viewDate: Date = new Date();
  dragToCreateActive = false;
  clickedDate: Date;
  isBeforeViewRenderApiRequired:boolean = true;
  clickedColumn: number;
  body: {patientId: number, startDateTime: string};
  addDaysbody: {dayOfWeek: number};
  changeConsultbody: {physicalConsultationDuration: number};
  addWorkingHoursbody:{
    dayOfWeek: number,
    startTime: string,
    endTime: string
  };
  appointmentInRangeOldResponse: IAppointmentsInRange;
  appointmentInRangeCurrentResponse: IAppointmentsInRange;
  events: any[] = [];
  patientDetails:IPatientDetails;
  excludeDays: number[] = [];
  hourColumns: WeekViewHourColumn[];
  hourSegment: number;
  workinghours: IWorkingHours[] = [];
  reserveAppointment: IReserveAppointments;
  eventCount: number = 0;
  segmentElementt: HTMLElement;
  dragToSelectEventt: CalendarEvent
  dating:string;
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  activeDayIsOpen: boolean = true;
  period: CalendarViewPeriod;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  addDaysOff: IDaysOff;
  addWorkingHours:IWorkingHours;
  modalRef: BsModalRef;
  changedConsultaion:IConsulationDuration;
  startDateTime
  endDateTime
  isAddingPatient: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private settingService:AppointmentSettingsService,
    private modal: NgbModal,
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private homeservice:HomeService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private appointmentsInRangeService:AppointmentsInRangeService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const PhysicalAppointmentId = this.activatedRoute.snapshot.params.PhysicalAppointmentId;

    this.startDateTime = this.activatedRoute.snapshot.params.StartDateTime;
    this.endDateTime  = this.activatedRoute.snapshot.params.EndDateTime;
    if (this.startDateTime && this.endDateTime) {
      this.appointmentsInRangeService.getAppointmentsInRange(this.startDateTime,this.endDateTime).subscribe(res => {
        this.mapAppointmentsToEvents(res.data);
      });
    }


    this.appointmentsInRangeService.deleteAppointment(PhysicalAppointmentId);

    // this.patientInfoForm
    //   .get('phoneNumber')
    //   .valueChanges.subscribe((response) => {
    //     this.isViewPatientEmr = false;
    //   });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  handleEvent(action: string, event: CalendarEvent){
    this.modalData = { event, action };
    this.modal.open(this.modalContent1, { size: 'lg' });
    this.showPatientDetails(event["patientId"]);
  }

  beforeViewRender(event: CalendarWeekViewBeforeRenderEvent) {
    if(!this.isBeforeViewRenderApiRequired)
    {
      this.disableSegmentsOutsideWorkingHours(this.appointmentInRangeCurrentResponse, event);
      return;
    }

    this.eventCount++;
    let startDateTime = this.datePipe.transform(event.period.start, 'yyyy-MM-dd');
    let endDateTime = this.datePipe.transform(event.period.end, 'yyyy-MM-dd');
    this.appointmentInRangeOldResponse = this.appointmentInRangeCurrentResponse;

    this.appointmentsInRangeService.getAppointmentsInRange(startDateTime, endDateTime)
      .subscribe(res => {
        this.appointmentInRangeCurrentResponse = res.data;
        if((JSON.stringify(this.appointmentInRangeCurrentResponse)
          !== JSON.stringify(this.appointmentInRangeOldResponse)) ||
          this.eventCount == 3){
          this.mapAppointmentsToEvents(res.data);
        }

        this.disableSegmentsOutsideWorkingHours(res.data, event);
      });

  }

  disableSegmentsOutsideWorkingHours(appointmentDetails: IAppointmentsInRange, event: CalendarWeekViewBeforeRenderEvent){
    let disabledSegments = this.getSegmentsOutsideWorkingHours(appointmentDetails.workingHours, event);
    disabledSegments.forEach(s => s.cssClass = 'bg-disabled not-clickable')

    this.cdr.markForCheck()
  }

  mapAppointmentsToEvents(appointmentDetails: IAppointmentsInRange){
    this.excludeDays = appointmentDetails.daysOff.map(e=>
      e.dayOfWeek,
    )

    this.events = appointmentDetails.physicalAppointments.map(a => {
      return {
        id:a.appointmentId,
        title: a.patientName,
        patientId: a.patientId,
        start: new Date(a.startTime),
        color: {primary: '#e3bc08', secondary: '#FDF1BA'},
        meta: {
          time: a.endTime
        },
        actions:[
          {
            label:'<i class="fas fa-fw fa-trash-alt"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {

              this.appointmentsInRangeService.deleteAppointment(event.id).subscribe(
                appointmentDetails=>{
                  if(appointmentDetails.data.flag == false){
                    alert(appointmentDetails.errorList)
                  }
                  else{
                    alert(appointmentDetails.message)
                    this.events = this.events.filter((iEvent) => iEvent !== event);
                  }
                }
              )
            },
          }
        ]
      }
    });

    this.hourSegment = appointmentDetails.hourSegment;

    this.workinghours = appointmentDetails.workingHours;

    this.cdr.detectChanges();
  }

  getSegmentsOutsideWorkingHours(workingHours: IWorkingHours[], event: CalendarWeekViewBeforeRenderEvent){
    let segments = event.hourColumns.flatMap(hc => hc.hours.flatMap(h => h.segments));

    return segments.filter(s => workingHours.every(wh => wh.dayOfWeek != s.date.getDay()
      || !(wh.dayOfWeek == s.date.getDay()
      && timeToDecimal(`${s.date.getHours()}:${s.date.getMinutes()}`) >= timeToDecimal(wh.startTime)
      && timeToDecimal(`${s.date.getHours()}:${s.date.getMinutes()}`) <= timeToDecimal(wh.endTime))))
  }

  reserveAppointmentAndMap(reservedAppointment: IReserveAppointments){
    this.spinner.show();
    this.reserveAppointment = reservedAppointment;
    this.isBeforeViewRenderApiRequired = false;
    this.appointmentInRangeCurrentResponse.physicalAppointments.push(reservedAppointment);
    this.mapAppointmentsToEvents(this.appointmentInRangeCurrentResponse);
    this.isBeforeViewRenderApiRequired = true;
    this.spinner.hide();
  }

  showPatientDetails(patientId){
    this.modal.open(this.modalContent1, { size: 'lg' });
    this.appointmentsInRangeService.getPatientDetails(patientId).subscribe(res=>{
      let birthdate = res.data.birthdate;
      this.patientDetails = res.data
      this.patientDetails.birthdate = this.datePipe.transform(birthdate, 'yyyy-MM-dd')
    })
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement,
    dragToSelectEvent: CalendarEvent

  ):void {
    this.dragToSelectEventt = dragToSelectEvent
    this.dating = this.datePipe.transform(segment.date, 'yyyy-MM-dd HH:mm:ss')

    if(segment.date <= new Date()){
      alert('cannot reserve appointment in the past');
    }
    else{
      this.openReserveAppointmentModal();
    }
  }

  openDaysOffModal(){
    let availableDays = WeekDays.filter(d => !this.appointmentInRangeCurrentResponse.daysOff
      .some(appDayOff => appDayOff.dayOfWeek == d.dayNo))
    const initialState: ModalOptions<any> = {
      keyboard: true,
      class: 'modal-dialog-centered',
      initialState: {
        title: 'Add Days Off',
        availableDays: availableDays
      }
    };

    this.modalRef = this.modalService.show(
      DaysOffComponent,
      initialState
    );

    this.modalRef.content.event.subscribe((response: number) => {
      if(response){
        this.addDaysbody = {
          dayOfWeek: response
        }
        this.settingService.addDayOff(this.addDaysbody).subscribe((addedDaysOff)=>{
          this.addDaysOff = addedDaysOff.data;
          if(addedDaysOff.data == null){
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
          }
          else{
            showNotification('success', addedDaysOff.message, this.toastr);
            this.isBeforeViewRenderApiRequired = false;
            this.appointmentInRangeCurrentResponse.daysOff.push(addedDaysOff.data);
            this.mapAppointmentsToEvents(this.appointmentInRangeCurrentResponse);
            this.isBeforeViewRenderApiRequired = true;
          }
        })
      }
    });
  }

  openConsulationDurationModal(){
    let availableDuration = HourSegment.filter(c => {
      return c.segment != this.appointmentInRangeCurrentResponse.hourSegment;
    })

    const initialState: ModalOptions<any> = {
      keyboard: true,
      class: 'modal-dialog-centered',
      initialState: {
        title: 'Change Consultaion Duration',
        availableDuration: availableDuration
      }
    };

    this.modalRef = this.modalService.show(
      ConsultaionDurationModalComponent,
      initialState
    );

    this.modalRef.content.event.subscribe((response: number) => {
      if(response){
        this.changeConsultbody = {
          physicalConsultationDuration:response
        }
        this.settingService.changeConsultaionDuration(this.changeConsultbody).subscribe((ChangedDuration)=>{
          this.changedConsultaion = ChangedDuration.data;
          if (ChangedDuration.data.flag == true){
            showNotification('success', ChangedDuration.message, this.toastr);
            this.isBeforeViewRenderApiRequired = false;
            this.appointmentInRangeCurrentResponse.hourSegment = response;
            this.mapAppointmentsToEvents(this.appointmentInRangeCurrentResponse);
            this.isBeforeViewRenderApiRequired = true;
          }
          else{
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
          }

        })
      }
    });
  }

  openWorkingHoursModal(){
    let availableDays = WeekDays.filter(d => !this.appointmentInRangeCurrentResponse.workingHours
      .some(appWorkingHours => appWorkingHours.dayOfWeek == d.dayNo))
    const initialState: ModalOptions<any> = {
      keyboard: true,
      class: 'modal-dialog-centered',
      initialState: {
        title: 'Add Working Hours',
        availableDays: availableDays,
      }
    };

    this.modalRef = this.modalService.show(
      WorkingHoursModalComponent,
      initialState
    );

    this.modalRef.content.event.subscribe((response) => {
      if(response){
        this.addWorkingHoursbody = {
          dayOfWeek:response.dayOfWeek,
          startTime:response.startTime,
          endTime:response.endTime
        }
        this.settingService.addWorkingHours(this.addWorkingHoursbody).subscribe((addedWorkingHours)=>{
          this.addWorkingHours = addedWorkingHours.data;
          if(addedWorkingHours.data = null){
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
          }
          else{
            showNotification('success', addedWorkingHours.message, this.toastr);
            this.isBeforeViewRenderApiRequired = false;
            this.appointmentInRangeCurrentResponse.workingHours.push(addedWorkingHours.data);
            this.mapAppointmentsToEvents(this.appointmentInRangeCurrentResponse);
            this.isBeforeViewRenderApiRequired = true;
            window.location.reload();
            this.cdr.detectChanges()
          }
        })
      }
    });
  }

  openReserveAppointmentModal(){
    let availableDays = WeekDays.filter(d => !this.appointmentInRangeCurrentResponse.daysOff
      .some(appDayOff => appDayOff.dayOfWeek == d.dayNo))
    const initialState: ModalOptions<any> = {
      keyboard: true,
      class: 'modal-dialog-centered',
      initialState: {
        appointmentStartDate: this.dating
      }
    };

    this.modalRef = this.modalService.show(
      ReserveAppointmentModalComponent,
      initialState
    );

    this.modalRef.content.event.subscribe((response: IReserveAppointments) => {
      this.reserveAppointmentAndMap(response);
    });
  }
}






