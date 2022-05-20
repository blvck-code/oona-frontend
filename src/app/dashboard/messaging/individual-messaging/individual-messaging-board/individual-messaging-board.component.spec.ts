import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualMessagingBoardComponent } from './individual-messaging-board.component';

describe('IndividualMessagingBoardComponent', () => {
  let component: IndividualMessagingBoardComponent;
  let fixture: ComponentFixture<IndividualMessagingBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualMessagingBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualMessagingBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
