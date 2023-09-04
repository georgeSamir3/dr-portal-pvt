import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmrMedicalTestsComponent } from './emr-medical-tests.component';

describe('EmrMedicalTestsComponent', () => {
  let component: EmrMedicalTestsComponent;
  let fixture: ComponentFixture<EmrMedicalTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmrMedicalTestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmrMedicalTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
