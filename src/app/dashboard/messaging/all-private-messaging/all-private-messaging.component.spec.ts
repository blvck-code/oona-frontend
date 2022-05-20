import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPrivateMessagingComponent } from './all-private-messaging.component';

describe('AllPrivateMessagingComponent', () => {
  let component: AllPrivateMessagingComponent;
  let fixture: ComponentFixture<AllPrivateMessagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPrivateMessagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPrivateMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
