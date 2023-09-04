import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveAppointmentModalComponent } from './reserve-appointment-modal.component';

describe('ReserveAppointmentModalComponent', () => {
  let component: ReserveAppointmentModalComponent;
  let fixture: ComponentFixture<ReserveAppointmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReserveAppointmentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveAppointmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
