import { TestBed } from '@angular/core/testing';

import { CustomLabelsService } from './custom-labels.service';

describe('CustomLabelsService', () => {
  let service: CustomLabelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomLabelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
