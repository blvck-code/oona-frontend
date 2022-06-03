import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMsgTextEditorComponent } from './all-msg-text-editor.component';

describe('AllMsgTextEditorComponent', () => {
  let component: AllMsgTextEditorComponent;
  let fixture: ComponentFixture<AllMsgTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllMsgTextEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMsgTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
