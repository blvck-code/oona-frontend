import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveTagComponent } from './inactive-tag.component';

describe('InactiveTagComponent', () => {
  let component: InactiveTagComponent;
  let fixture: ComponentFixture<InactiveTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InactiveTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
