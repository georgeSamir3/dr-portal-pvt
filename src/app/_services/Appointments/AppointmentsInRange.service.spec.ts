/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppointmentsInRangeService } from './AppointmentsInRange.service';

describe('Service: AppointmentsInRange', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppointmentsInRangeService]
    });
  });

  it('should ...', inject([AppointmentsInRangeService], (service: AppointmentsInRangeService) => {
    expect(service).toBeTruthy();
  }));
});
