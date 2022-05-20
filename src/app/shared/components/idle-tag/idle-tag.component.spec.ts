import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdleTagComponent } from './idle-tag.component';

describe('IdleTagComponent', () => {
  let component: IdleTagComponent;
  let fixture: ComponentFixture<IdleTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdleTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdleTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
