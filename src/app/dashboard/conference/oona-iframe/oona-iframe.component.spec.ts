import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OonaIframeComponent } from './oona-iframe.component';

describe('OonaIframeComponent', () => {
  let component: OonaIframeComponent;
  let fixture: ComponentFixture<OonaIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OonaIframeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OonaIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
