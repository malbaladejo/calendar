import { TestBed } from '@angular/core/testing';

import { SpecialdaysService } from './specialdays.service';

describe('SpecialdaysService', () => {
  let service: SpecialdaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialdaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
