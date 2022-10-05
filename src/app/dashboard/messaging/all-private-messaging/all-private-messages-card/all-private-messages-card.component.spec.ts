import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPrivateMessagesCardComponent } from './all-private-messages-card.component';

describe('AllPrivateMessagesCardComponent', () => {
  let component: AllPrivateMessagesCardComponent;
  let fixture: ComponentFixture<AllPrivateMessagesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPrivateMessagesCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPrivateMessagesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
