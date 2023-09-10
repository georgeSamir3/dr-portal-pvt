import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicFeesComponent } from './clinic-fees.component';

describe('ClinicFeesComponent', () => {
  let component: ClinicFeesComponent;
  let fixture: ComponentFixture<ClinicFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicFeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
