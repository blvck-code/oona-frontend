import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTimeBtnComponent } from './message-time-btn.component';

describe('MessageTimeBtnComponent', () => {
  let component: MessageTimeBtnComponent;
  let fixture: ComponentFixture<MessageTimeBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageTimeBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTimeBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
