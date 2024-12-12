import { TestBed } from '@angular/core/testing';

import { ProvinceApiService } from './province-api.service';

describe('ProvinceApiService', () => {
  let service: ProvinceApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvinceApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
