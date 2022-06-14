import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingTextEditorComponent } from './landing-text-editor.component';

describe('LandingTextEditorComponent', () => {
  let component: LandingTextEditorComponent;
  let fixture: ComponentFixture<LandingTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingTextEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
