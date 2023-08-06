import { TestBed } from '@angular/core/testing';

import { CustomLabelsDataRemoteService } from './custom-labels-data-remote.service';

describe('CustomLabelsDataRemoteService', () => {
  let service: CustomLabelsDataRemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomLabelsDataRemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
