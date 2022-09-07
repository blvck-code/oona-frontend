import { Component, OnInit } from '@angular/core';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../state/app.state';
import {Observable} from 'rxjs';
import {SingleMessageModel} from '../models/messages.model';
import {getUnreadStreamMessages} from '../state/messaging.selectors';
import * as messagingActions from '../state/messaging.actions';
import {NavigationEnd, Router} from '@angular/router';
import {MessagingService} from '../services/messaging.service';


@Component({
  selector: 'app-team-messaging',
  templateUrl: './team-messaging.component.html',
  styleUrls: ['./team-messaging.component.scss']
})
export class TeamMessagingComponent implements OnInit {
  unreadMessageId: number[] = [];
  messageUpdate$!: Observable<SingleMessageModel[]>;

  constructor(
    private store: Store<AppState>,
    private messageSrv: MessagingService
  ) {

  }

  ngOnInit(): void {
    this.messageUpdate$ = this.store.select(getUnreadStreamMessages);
    this.updateMessageFlags();
  }

  updateMessageFlags(): void {
    const unreadMessageId: number[] = [];

    this.messageUpdate$.subscribe(
      (messages: SingleMessageModel[]) => {
        messages.map((message: SingleMessageModel) => {
          if (unreadMessageId.includes(message.id)) { return; }

          this.messageSrv.updateMessageFlag(message.id).subscribe(
            (response: any) => {
              const messageId = response.messages[0];
              this.store.dispatch(new messagingActions.UpdateReadMessageSuccess(messageId));
            }
          );
          unreadMessageId.push(message.id);
        });
      });
  }
}
