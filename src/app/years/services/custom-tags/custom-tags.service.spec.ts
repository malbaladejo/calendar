import { TestBed } from '@angular/core/testing';

import { CustomTagsService } from './custom-tags.service';

describe('CustomTagsService', () => {
  let service: CustomTagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomTagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
