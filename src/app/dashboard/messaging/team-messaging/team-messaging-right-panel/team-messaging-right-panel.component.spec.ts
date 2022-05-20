import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMessagingRightPanelComponent } from './team-messaging-right-panel.component';

describe('TeamMessagingRightPanelComponent', () => {
  let component: TeamMessagingRightPanelComponent;
  let fixture: ComponentFixture<TeamMessagingRightPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMessagingRightPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMessagingRightPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
