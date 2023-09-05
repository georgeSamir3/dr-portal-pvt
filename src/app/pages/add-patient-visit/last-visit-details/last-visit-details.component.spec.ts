import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastVisitDetailsComponent } from './last-visit-details.component';

describe('LastVisitDetailsComponent', () => {
  let component: LastVisitDetailsComponent;
  let fixture: ComponentFixture<LastVisitDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastVisitDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastVisitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
