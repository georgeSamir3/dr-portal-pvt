import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsDataComponent } from './vitals-data.component';

describe('VitalsDataComponent', () => {
  let component: VitalsDataComponent;
  let fixture: ComponentFixture<VitalsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VitalsDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
