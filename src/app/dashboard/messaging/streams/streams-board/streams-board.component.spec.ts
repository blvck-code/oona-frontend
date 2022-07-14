import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamsBoardComponent } from './streams-board.component';

describe('StreamsBoardComponent', () => {
  let component: StreamsBoardComponent;
  let fixture: ComponentFixture<StreamsBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamsBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamsBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
