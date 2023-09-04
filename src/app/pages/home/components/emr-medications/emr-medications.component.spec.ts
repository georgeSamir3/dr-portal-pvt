import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmrMedicationsComponent } from './emr-medications.component';

describe('EmrMedicationsComponent', () => {
  let component: EmrMedicationsComponent;
  let fixture: ComponentFixture<EmrMedicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmrMedicationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmrMedicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
