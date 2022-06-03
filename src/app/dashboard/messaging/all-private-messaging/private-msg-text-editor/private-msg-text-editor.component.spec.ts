import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateMsgTextEditorComponent } from './private-msg-text-editor.component';

describe('PrivateMsgTextEditorComponent', () => {
  let component: PrivateMsgTextEditorComponent;
  let fixture: ComponentFixture<PrivateMsgTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateMsgTextEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateMsgTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
