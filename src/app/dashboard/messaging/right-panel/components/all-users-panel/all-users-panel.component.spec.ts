import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUsersPanelComponent } from './all-users-panel.component';

describe('AllUsersPanelComponent', () => {
  let component: AllUsersPanelComponent;
  let fixture: ComponentFixture<AllUsersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllUsersPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllUsersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
