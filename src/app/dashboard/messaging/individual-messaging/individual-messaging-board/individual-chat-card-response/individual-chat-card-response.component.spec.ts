import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualChatCardResponseComponent } from './individual-chat-card-response.component';

describe('IndividualChatCardResponseComponent', () => {
  let component: IndividualChatCardResponseComponent;
  let fixture: ComponentFixture<IndividualChatCardResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualChatCardResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualChatCardResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
