import { TestBed } from '@angular/core/testing';

import { ScheduleDataLocalStorageService } from './schedule-data-local-storage.service';

describe('ScheduleDataLocalStorageService', () => {
  let service: ScheduleDataLocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleDataLocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
