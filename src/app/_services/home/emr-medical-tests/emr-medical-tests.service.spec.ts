import { TestBed } from '@angular/core/testing';

import { EmrMedicalTestsService } from './emr-medical-tests.service';

describe('EmrMedicalTestsService', () => {
  let service: EmrMedicalTestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmrMedicalTestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
