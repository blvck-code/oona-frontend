import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPmsComponent } from './group-pms.component';

describe('GroupPmsComponent', () => {
  let component: GroupPmsComponent;
  let fixture: ComponentFixture<GroupPmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupPmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupPmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
