import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingMessagingRightPanelComponent } from './landing-messaging-right-panel.component';

describe('LandingMessagingRightPanelComponent', () => {
  let component: LandingMessagingRightPanelComponent;
  let fixture: ComponentFixture<LandingMessagingRightPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingMessagingRightPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingMessagingRightPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
