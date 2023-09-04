import { TestBed } from '@angular/core/testing';

import { PatientEmrDetailsService } from './patient-emr-details.service';

describe('PatientEmrDetailsService', () => {
  let service: PatientEmrDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientEmrDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
