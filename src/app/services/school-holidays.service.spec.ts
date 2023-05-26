import { TestBed } from '@angular/core/testing';

import { SchoolHolidaysService } from './school-holidays.service';

describe('SchoolHolidaysService', () => {
  let service: SchoolHolidaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolHolidaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
