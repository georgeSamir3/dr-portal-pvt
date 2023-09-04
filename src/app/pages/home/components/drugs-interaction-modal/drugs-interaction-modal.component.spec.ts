import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugsInteractionModalComponent } from './drugs-interaction-modal.component';

describe('DrugsInteractionModalComponent', () => {
  let component: DrugsInteractionModalComponent;
  let fixture: ComponentFixture<DrugsInteractionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugsInteractionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugsInteractionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
