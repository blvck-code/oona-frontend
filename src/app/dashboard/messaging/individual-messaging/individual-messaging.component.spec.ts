import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualMessagingComponent } from './individual-messaging.component';

describe('IndividualMessagingComponent', () => {
  let component: IndividualMessagingComponent;
  let fixture: ComponentFixture<IndividualMessagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualMessagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
