import { TestBed } from '@angular/core/testing';

import { ChatBoardService } from './chat-board.service';

describe('ChatBoardService', () => {
  let service: ChatBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
