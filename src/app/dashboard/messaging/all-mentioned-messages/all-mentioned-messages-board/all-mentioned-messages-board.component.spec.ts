import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMentionedMessagesBoardComponent } from './all-mentioned-messages-board.component';

describe('AllMentionedMessagesBoardComponent', () => {
  let component: AllMentionedMessagesBoardComponent;
  let fixture: ComponentFixture<AllMentionedMessagesBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllMentionedMessagesBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMentionedMessagesBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
