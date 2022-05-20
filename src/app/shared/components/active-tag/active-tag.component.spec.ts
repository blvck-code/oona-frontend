import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTagComponent } from './active-tag.component';

describe('ActiveTagComponent', () => {
  let component: ActiveTagComponent;
  let fixture: ComponentFixture<ActiveTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
