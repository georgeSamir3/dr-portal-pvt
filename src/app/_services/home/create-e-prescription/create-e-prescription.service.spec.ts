import { TestBed } from '@angular/core/testing';

import { CreateEPrescriptionService } from './create-e-prescription.service';

describe('CreateEPrescriptionService', () => {
  let service: CreateEPrescriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateEPrescriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
