/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppointmentSettingsService } from './appointment-settings.service';

describe('Service: AppointmentSettings', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppointmentSettingsService]
    });
  });

  it('should ...', inject([AppointmentSettingsService], (service: AppointmentSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
