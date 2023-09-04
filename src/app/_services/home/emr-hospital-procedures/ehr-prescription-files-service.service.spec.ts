import { TestBed } from '@angular/core/testing';

import { EhrPrescriptionFilesServiceService } from './ehr-prescription-files-service.service';

describe('EhrPrescriptionFilesServiceService', () => {
  let service: EhrPrescriptionFilesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EhrPrescriptionFilesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
