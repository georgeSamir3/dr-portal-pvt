/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GliptusPmsService } from './gliptus-pms.service';

describe('Service: GliptusPms', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GliptusPmsService]
    });
  });

  it('should ...', inject([GliptusPmsService], (service: GliptusPmsService) => {
    expect(service).toBeTruthy();
  }));
});
