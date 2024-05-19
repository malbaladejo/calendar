import { TestBed } from '@angular/core/testing';

import { YearNavigationService } from './year-navigation.service';

describe('YearNavigationService', () => {
  let service: YearNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YearNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
