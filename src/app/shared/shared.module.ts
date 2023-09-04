import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ToastrModule } from 'ngx-toastr';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { ApiUrlService } from '@services/api-url/api-url.service';
import { SearchFilterPipe } from '@pipes/search-filter.pipe';
import { PageHeaderBreadcrumbComponent } from '@shared/components/page-header-breadcrumb/page-header-breadcrumb.component';
import { NgxPrintModule } from 'ngx-print';
import { GetChannelNamePipe } from '@pipes/get-channel-name.pipe';
import { TableComponent } from '@components/table/table.component';
import { RemoveSpacesPipe } from '@pipes/remove-spaces.pipe';
import { RemoveSpecialCharactersPipe } from '@pipes/remove-special-characters.pipe';
import { GetTestPrescriptionNamePipe } from '@pipes/get-test-prescription-name.pipe';
import { GeneralTopUsedServicesComponent } from '@components/GeneralTopUsedServices/GeneralTopUsedServices.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DateInputComponent } from './components/date-input/date-input.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SearchComponent } from '@components/search/search.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PrimngModule } from './primng.module';

@NgModule({
  declarations: [
    SearchFilterPipe,
    PageHeaderBreadcrumbComponent,
    GetChannelNamePipe,
    TableComponent,
    RemoveSpacesPipe,
    RemoveSpecialCharactersPipe,
    GetTestPrescriptionNamePipe,
    GeneralTopUsedServicesComponent,
    DateInputComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    InfiniteScrollModule,
    ProgressbarModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    ToastrModule.forRoot(),
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    PopoverModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    NgxPrintModule,
    NgxDatatableModule,
    NgSelectModule,
    PrimngModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    InfiniteScrollModule,
    ProgressbarModule,
    BsDatepickerModule,
    ModalModule,
    AlertModule,
    ToastrModule,
    CollapseModule,
    BsDropdownModule,
    PopoverModule,
    NgMultiSelectDropDownModule,
    PaginationModule,
    TooltipModule,
    NgxPrintModule,
    SearchFilterPipe,
    PageHeaderBreadcrumbComponent,
    GetChannelNamePipe,
    TableComponent,
    RemoveSpacesPipe,
    RemoveSpecialCharactersPipe,
    GetTestPrescriptionNamePipe,
    GeneralTopUsedServicesComponent,
    DateInputComponent,
    NgxDatatableModule,
    SearchComponent,
    NgSelectModule,
    CommonModule,
    PrimngModule,
  ],
  providers: [
    ApiUrlService,
    DatePipe
  ]
})
export class SharedModule { }
