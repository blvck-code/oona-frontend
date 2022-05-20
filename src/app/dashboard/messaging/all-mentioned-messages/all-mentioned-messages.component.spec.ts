import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMentionedMessagesComponent } from './all-mentioned-messages.component';

describe('AllMentionedMessagesComponent', () => {
  let component: AllMentionedMessagesComponent;
  let fixture: ComponentFixture<AllMentionedMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllMentionedMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMentionedMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
