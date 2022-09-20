import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualUserPanelComponent } from './individual-user-panel.component';

describe('IndividualUserPanelComponent', () => {
  let component: IndividualUserPanelComponent;
  let fixture: ComponentFixture<IndividualUserPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualUserPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualUserPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
