import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EhrPrescriptionDetailsComponent } from './ehr-prescription-details.component';

describe('EhrPrescriptionDetailsComponent', () => {
  let component: EhrPrescriptionDetailsComponent;
  let fixture: ComponentFixture<EhrPrescriptionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EhrPrescriptionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EhrPrescriptionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
