import { TestBed } from '@angular/core/testing';

import { EmrMedicationsService } from './emr-medications.service';

describe('EmrMedicationsService', () => {
  let service: EmrMedicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmrMedicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
