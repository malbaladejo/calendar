import { TestBed } from '@angular/core/testing';

import { CustomLabelsDataService } from './custom-labels-data.service';

describe('CustomLabelsDataService', () => {
  let service: CustomLabelsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomLabelsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
