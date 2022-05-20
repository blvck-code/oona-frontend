import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingMessageBoardComponent } from './landing-message-board.component';

describe('LandingMessageBoardComponent', () => {
  let component: LandingMessageBoardComponent;
  let fixture: ComponentFixture<LandingMessageBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingMessageBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingMessageBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
