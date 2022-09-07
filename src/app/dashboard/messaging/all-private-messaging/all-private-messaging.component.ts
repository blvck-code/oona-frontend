import { Component, OnInit } from '@angular/core';
import {OonaSocketService} from '../services/oona-socket.service';

// NgRx
import { Store } from '@ngrx/store';
import * as messagingActions from '../state/messaging.actions';
import {AppState} from '../../../state/app.state';
import {getAllUsers, getUserDetails, getZulipUsers} from '../../../auth/state/auth.selectors';
import {firmName} from '../../../../environments/environment';
import {MessagingService} from '../services/messaging.service';
import {BehaviorSubject} from 'rxjs';

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
    private store: Store<AppState>,
    private messagesService: MessagingService
  ) { }

  ngOnInit(): void {
    this.changeMessageCount();
    this.handlePrivateUnread();
  }

  // Todo update this messages flad to read on component load
  handlePrivateUnread(): void {
    setTimeout(() => {
      this.messagesService.privateUnreadMsgArrayObservable.subscribe(
        messages => {
          console.log('All private unread messages ==>>>', messages);
        }
      );
    }, 500);
  }

  private changeMessageCount(): void {
    this.userSocketService.newMessageCount = 0;
    this.userSocketService.changeNewMessageCount(0);

    this.userSocketService.newMessageCount = 0;
    this.userSocketService.changeNewMessageCount(this.userSocketService.newMessageCount);
  }

  // onInitHandler(): void {
  //   document.title = `Private messages - ${firmName} - Oona`;
  //   this.store.select(getUserDetails).subscribe(
  //     data => {
  //       this.operand = data?.email;
  //     }
  //   );
  //
  //   // Message parameters
  //   const streamDetail = {
  //     use_first_unread_anchor: true,
  //     apply_markdown: false,
  //     num_before: this.initialMessageCount,
  //     type: [
  //       {
  //         operator: 'pm-with',
  //         // change to user.email
  //         operand: this.operand,
  //       }
  //     ]
  //   };
  //
  //   // fetch from server
  //   this.store.dispatch(new messagingActions.LoadPrivateMessages(streamDetail));
  // }
}
