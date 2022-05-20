import { TestBed } from '@angular/core/testing';

import { IndividualMessagingService } from './individual-messaging.service';

describe('IndividualMessagingService', () => {
  let service: IndividualMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndividualMessagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
