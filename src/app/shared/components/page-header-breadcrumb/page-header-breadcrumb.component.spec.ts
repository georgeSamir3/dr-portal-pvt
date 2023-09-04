import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeaderBreadcrumbComponent } from './page-header-breadcrumb.component';

describe('PageHeaderBreadcrumbComponent', () => {
  let component: PageHeaderBreadcrumbComponent;
  let fixture: ComponentFixture<PageHeaderBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageHeaderBreadcrumbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageHeaderBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
