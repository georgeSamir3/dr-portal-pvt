import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientVisitComponent } from './add-patient-visit.component';

describe('AddPatientVisitComponent', () => {
  let component: AddPatientVisitComponent;
  let fixture: ComponentFixture<AddPatientVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPatientVisitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPatientVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
