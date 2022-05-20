import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousMeetingsComponent } from './previous-meetings.component';

describe('PreviousMeetingsComponent', () => {
  let component: PreviousMeetingsComponent;
  let fixture: ComponentFixture<PreviousMeetingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousMeetingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
