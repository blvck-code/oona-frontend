import { Component, OnInit } from '@angular/core';
import {OonaSocketService} from '../services/oona-socket.service';

// NgRx
import { Store } from '@ngrx/store';
import * as messagingActions from '../state/messaging.actions';
import {AppState} from '../../../state/app.state';
import {getUserDetails} from '../../../auth/state/auth.selectors';

@Component({
  selector: 'app-all-private-messaging',
  templateUrl: './all-private-messaging.component.html',
  styleUrls: ['./all-private-messaging.component.scss']
})
export class AllPrivateMessagingComponent implements OnInit {
  initialMessageCount = 10;
  operand: string | null | undefined = '';

  constructor(
    private userSocketService: OonaSocketService,
    private store: Store<AppState>
  ) { }

  onInitHandler(): void {
    this.store.select(getUserDetails).subscribe(
      data => {
        this.operand = data?.email;
        console.log('User details ===>>>', data);
      }
    );

    // Message parameters
    const streamDetail = {
      use_first_unread_anchor: true,
      apply_markdown: false,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'pm-with',
          // change to user.email
          operand: this.operand,
        }
      ]
    };
    console.log('streamDetail ====>>>', streamDetail);

    // fetch from server
    this.store.dispatch(new messagingActions.LoadPrivateMessages(streamDetail));
  }

  ngOnInit(): void {
    this.onInitHandler();
    this.changeMessageCount();
  }

  private changeMessageCount(): void {
    this.userSocketService.newMessageCount = 0;
    this.userSocketService.changeNewMessageCount(0);

    this.userSocketService.newMessageCount = 0;
    this.userSocketService.changeNewMessageCount(this.userSocketService.newMessageCount);
  }
}
