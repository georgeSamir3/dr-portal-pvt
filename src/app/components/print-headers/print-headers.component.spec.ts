import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintHeadersComponent } from './print-headers.component';

describe('PrintHeadersComponent', () => {
  let component: PrintHeadersComponent;
  let fixture: ComponentFixture<PrintHeadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintHeadersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintHeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
