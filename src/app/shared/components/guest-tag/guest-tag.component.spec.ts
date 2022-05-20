import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestTagComponent } from './guest-tag.component';

describe('GuestTagComponent', () => {
  let component: GuestTagComponent;
  let fixture: ComponentFixture<GuestTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
