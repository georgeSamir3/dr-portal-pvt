/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EmrHospitalprocedureDetailsComponent } from './emr-hospitalprocedure-details.component';

describe('EmrHospitalprocedureDetailsComponent', () => {
  let component: EmrHospitalprocedureDetailsComponent;
  let fixture: ComponentFixture<EmrHospitalprocedureDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmrHospitalprocedureDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmrHospitalprocedureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
