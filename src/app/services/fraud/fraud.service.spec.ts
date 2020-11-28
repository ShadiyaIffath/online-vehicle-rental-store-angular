import { TestBed } from '@angular/core/testing';

import { FraudService } from './fraud.service';

describe('FraudService', () => {
  let service: FraudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FraudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
