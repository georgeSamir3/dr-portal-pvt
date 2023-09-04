import { TestBed } from '@angular/core/testing';

import { PatientsWithDoctorService} from './patients-with-doctor.service';

describe('PatientsWithDoctorService', () => {
  let service: PatientsWithDoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientsWithDoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
