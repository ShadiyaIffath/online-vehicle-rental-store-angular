import { TestBed } from '@angular/core/testing';

import { DmvService } from './dmv.service';

describe('DmvService', () => {
  let service: DmvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DmvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
