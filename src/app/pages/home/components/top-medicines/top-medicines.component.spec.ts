import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMedicinesComponent } from './top-medicines.component';

describe('TopMedicinesComponent', () => {
  let component: TopMedicinesComponent;
  let fixture: ComponentFixture<TopMedicinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopMedicinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopMedicinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
