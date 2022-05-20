import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMessagingComponent } from './team-messaging.component';

describe('TeamMessagingComponent', () => {
  let component: TeamMessagingComponent;
  let fixture: ComponentFixture<TeamMessagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMessagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
