import { TestBed } from '@angular/core/testing';

import { TopMedicinesService } from './top-medicines.service';

describe('TopMedicinesService', () => {
  let service: TopMedicinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopMedicinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
