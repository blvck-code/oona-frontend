import { Component, OnInit } from '@angular/core';

// NgRx
import { Store } from '@ngrx/store';
import * as messagingActions from '../state/messaging.actions';
import {AppState} from '../../../state/app.state';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {
  initialMessageCount =  30;

  constructor(
    private store: Store<AppState>
  ) { }

  onIniHandler(): void {
    const streamDetail = {
      use_first_unread_anchor: true,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'stream',
          operand: 'general'
        }
      ]
    };
    this.store.dispatch(new messagingActions.LoadAllMessages(streamDetail));
  }

  ngOnInit(): void {
    this.onIniHandler();
  }

}
