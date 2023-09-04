import { TestBed } from '@angular/core/testing';

import { DrugDrugInteractionService } from './drug-drug-interaction.service';

describe('DrugDrugInteractionService', () => {
  let service: DrugDrugInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrugDrugInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
