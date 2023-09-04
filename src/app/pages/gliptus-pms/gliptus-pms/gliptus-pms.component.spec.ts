/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GliptusPmsComponent } from './gliptus-pms.component';

describe('GliptusPmsComponent', () => {
  let component: GliptusPmsComponent;
  let fixture: ComponentFixture<GliptusPmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GliptusPmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GliptusPmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
