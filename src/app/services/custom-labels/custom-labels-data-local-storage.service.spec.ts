import { TestBed } from '@angular/core/testing';

import { CustomLabelsDataLocalStorageService } from './custom-labels-data-local-storage.service';

describe('CustomLabelsDataLocalStorageService', () => {
  let service: CustomLabelsDataLocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomLabelsDataLocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
