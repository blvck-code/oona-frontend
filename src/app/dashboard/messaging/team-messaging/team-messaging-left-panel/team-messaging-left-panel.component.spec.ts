import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMessagingLeftPanelComponent } from './team-messaging-left-panel.component';

describe('TeamMessagingLeftPanelComponent', () => {
  let component: TeamMessagingLeftPanelComponent;
  let fixture: ComponentFixture<TeamMessagingLeftPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMessagingLeftPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMessagingLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
