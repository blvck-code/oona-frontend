import {Component, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from './state/app.state';
import * as authActions from './auth/state/auth.actions';
import * as sharedActions from './shared/state/shared.actions';
import {getIsLoggedIn} from './auth/state/auth.selectors';
import {OonaSocketService} from './dashboard/messaging/services/oona-socket.service';
import {ActivatedRoute} from '@angular/router';
import {Notification} from 'rxjs';

import {MessagingService} from "./dashboard/messaging/services/messaging.service";
import * as messagingActions from './dashboard/messaging/state/messaging.actions';
import {log} from 'util';
import {getUnreadMessages} from './dashboard/messaging/state/messaging.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'oona';
  navTitle = '';

  constructor(
    private store: Store<AppState>,
    private sockets: OonaSocketService,
    private messageSrv: MessagingService,
    private route: ActivatedRoute,
    private titleService: Title,
  ) {
  }

  updateState = () => {

    this.store.dispatch(new authActions.UpdateState());

    this.store.select(getIsLoggedIn).subscribe(
      status => {
        // console.log('Is logged in? ', status);
        if (status) {
          this.store.dispatch(new authActions.LoadAllUsers());
          this.store.dispatch(new authActions.LoadZulipUsers());
        }
      }
    );
  }

  tabNotification(): void {
    // let unreadMessages = 0;

    this.sockets.privateMsgCounterSubject.subscribe(
      newMessage => {
        const messages = this.sockets.messagesInPrivate;

        // console.log('Latest message content ====>>', messages);
        // console.log('Messages counter ===>>> ', newMessage);
      }
    );
  }

  ngOnInit(): void {
    this.updateState();
    this.initializeState();
    this.messageSrv.getStreamUnreadMessages();
    this.messageSrv.totalUnreadMsgCounterObservable.subscribe(
      numb => {
        document.title = `(${numb}) - AVL - Oona`;
      }
    )
  }

  initializeState(): void {
    this.store.dispatch(new messagingActions.LoadAllStreams());
    this.store.dispatch(new messagingActions.LoadSubStreams());
    this.store.dispatch(new authActions.LoadZulipUsers());
    this.store.dispatch(new authActions.LoadAllUsers());
  }


}
