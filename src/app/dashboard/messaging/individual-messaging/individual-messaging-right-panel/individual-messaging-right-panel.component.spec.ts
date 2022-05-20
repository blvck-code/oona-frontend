import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualMessagingRightPanelComponent } from './individual-messaging-right-panel.component';

describe('IndividualMessagingRightPanelComponent', () => {
  let component: IndividualMessagingRightPanelComponent;
  let fixture: ComponentFixture<IndividualMessagingRightPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualMessagingRightPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualMessagingRightPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
