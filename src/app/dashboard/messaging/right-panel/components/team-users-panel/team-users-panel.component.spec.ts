import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamUsersPanelComponent } from './team-users-panel.component';

describe('TeamUsersPanelComponent', () => {
  let component: TeamUsersPanelComponent;
  let fixture: ComponentFixture<TeamUsersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamUsersPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamUsersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
