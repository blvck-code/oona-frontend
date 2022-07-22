import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamsTextEditorComponent } from './streams-text-editor.component';

describe('StreamsTextEditorComponent', () => {
  let component: StreamsTextEditorComponent;
  let fixture: ComponentFixture<StreamsTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamsTextEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamsTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
