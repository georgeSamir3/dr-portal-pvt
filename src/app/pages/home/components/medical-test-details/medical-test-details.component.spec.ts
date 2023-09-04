import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalTestDetailsComponent } from './medical-test-details.component';

describe('MedicalTestDetailsComponent', () => {
  let component: MedicalTestDetailsComponent;
  let fixture: ComponentFixture<MedicalTestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalTestDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalTestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
