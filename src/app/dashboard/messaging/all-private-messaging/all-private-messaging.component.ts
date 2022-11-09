import { Component, OnInit } from '@angular/core';
import {OonaSocketService} from '../services/oona-socket.service';

// NgRx
import { Store } from '@ngrx/store';
import * as messagingActions from '../state/messaging.actions';
import {AppState} from '../../../state/app.state';
import {getAllUsers, getUserDetails, getZulipUsers} from '../../../auth/state/auth.selectors';
import {firmName} from '../../../../environments/environment';
import {MessagingService} from '../services/messaging.service';
import {BehaviorSubject, Observable} from 'rxjs';
import * as privateMshActions from '../../state/actions/private.messages.actions';
import {privateMessagesLoaded} from '../../state/entities/messages/private.messages.entity';

@Component({
  selector: 'app-all-private-messaging',
  templateUrl: './all-private-messaging.component.html',
  styleUrls: ['./all-private-messaging.component.scss']
})
export class AllPrivateMessagingComponent implements OnInit {
  initialMessageCount = 10;
  operand: string | null | undefined = '';

  loaded$: Observable<boolean> = this.store.select(privateMessagesLoaded);

  constructor(
    private userSocketService: OonaSocketService,
    private store: Store<AppState>,
    private messagesService: MessagingService
  ) { }

  ngOnInit(): void {
    this.changeMessageCount();
    this.handlePrivateUnread();

    this.loaded$.subscribe({
      next: (status) => {
        if (!status) {
          this.getPrivateMessages();
        }
      }
    });
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

  private getPrivateMessages(): void {
    const request = {
      anchor: 1905,
      num_before: 50,
      num_after: 50,
      narrow: [{
        negated: false,
        operator: 'is',
        operand: 'private'
      }],
      client_gravatar: true
    };

    this.store.dispatch(new privateMshActions.LoadPrivateMsg(request));

  }
}
