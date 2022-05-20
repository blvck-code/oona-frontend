import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPrivateMessagesBoardComponent } from './all-private-messages-board.component';

describe('AllPrivateMessagesBoardComponent', () => {
  let component: AllPrivateMessagesBoardComponent;
  let fixture: ComponentFixture<AllPrivateMessagesBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPrivateMessagesBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPrivateMessagesBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
