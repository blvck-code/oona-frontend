import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMeetingsComponent } from './team-meetings.component';

describe('TeamMeetingsComponent', () => {
  let component: TeamMeetingsComponent;
  let fixture: ComponentFixture<TeamMeetingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMeetingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
