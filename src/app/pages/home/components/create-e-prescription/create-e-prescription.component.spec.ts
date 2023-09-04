import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEPrescriptionComponent } from './create-e-prescription.component';

describe('CreateEPrescriptionComponent', () => {
  let component: CreateEPrescriptionComponent;
  let fixture: ComponentFixture<CreateEPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEPrescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
