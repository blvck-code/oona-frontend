import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualChatCardComponent } from './individual-chat-card.component';

describe('IndividualChatCardComponent', () => {
  let component: IndividualChatCardComponent;
  let fixture: ComponentFixture<IndividualChatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualChatCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualChatCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
