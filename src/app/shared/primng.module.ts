import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  imports: [
    TableModule,
    InputTextModule,
    InputNumberModule
  ],
  exports: [
    TableModule,
    InputTextModule,
    InputNumberModule
  ],
  declarations: []
})
export class PrimngModule { }
