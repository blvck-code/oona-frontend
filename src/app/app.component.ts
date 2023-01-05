import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

// NgRx
import { Store } from '@ngrx/store';
import { AppState } from './state/app.state';
import * as authActions from './auth/state/auth.actions';
import { getIsLoggedIn } from './auth/state/auth.selectors';
import { OonaSocketService } from './dashboard/messaging/services/oona-socket.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { MessagingService } from './dashboard/messaging/services/messaging.service';
import * as messagingActions from './dashboard/messaging/state/messaging.actions';
// import {getPrivateUnreadMessages, getStreamUnreadMessages} from './dashboard/messaging/state/messaging.selectors';
import { MessagesSocketService } from './dashboard/messaging/services/messages-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'oona';

  totalUnreadMsg = 0;
  totalUnreadMsgSubject$ = new BehaviorSubject<number>(this.totalUnreadMsg);
  totalUnreadMsgObservable = this.totalUnreadMsgSubject$.asObservable();

  streamUnread$!: Observable<number>;
  privateUnread$!: Observable<number>;

  constructor(
    private store: Store<AppState>,
    private sockets: OonaSocketService,
    private messageSrv: MessagingService,
    private route: ActivatedRoute,
    private titleService: Title,
    private oonaSockets: OonaSocketService,
    private msgSockets: MessagesSocketService
  ) {}

  updateState = () => {
    this.store.dispatch(new authActions.UpdateState());

    this.store.select(getIsLoggedIn).subscribe({
      next: (status: boolean) => {
        if (status) {
          // this.getTotalCounter();
          // this.tabNotification();
        }
      },
    });
  };

  tabNotification(): void {
    this.streamUnread$.subscribe((stream) => {
      this.privateUnread$.subscribe((privateUnread) => {
        this.totalUnreadMsgSubject$.next(privateUnread + stream);
      });
    });
  }

  ngOnInit(): void {
    this.updateState();
    this.handShakeSockets();
  }

  handShakeSockets(): void {
    this.store.select(getIsLoggedIn).subscribe({
      next: (status: boolean) => {
        if (status) {
          this.msgSockets.messageConnect();
          this.oonaSockets.getCurrentProfile();
          this.oonaSockets.connect();
          this.oonaSockets.userManagement();
        }
      },
    });
  }

  initializeState(): void {
    this.store.select(getIsLoggedIn).subscribe((status: boolean) => {
      if (status) {
        this.store.dispatch(new messagingActions.LoadAllStreams());
        this.store.dispatch(new messagingActions.LoadSubStreams());
        this.store.dispatch(new authActions.LoadZulipUsers());
        this.store.dispatch(new authActions.LoadPresentUsers());
        this.store.dispatch(new authActions.CurrentUserProfile());

        setTimeout(() => {
          this.getMessages();

          // this.streamUnread$ = this.store.select(getStreamUnreadMessages);
          // this.privateUnread$ = this.store.select(getPrivateUnreadMessages);
        }, 1000);
      }
    });
  }

  getTotalCounter(): void {
    this.totalUnreadMsgObservable.subscribe((numb: number) => {
      if (numb > 0) {
        this.titleService.setTitle(`(${numb}) - AVL - Oona`);
      } else {
        this.titleService.setTitle(`AVL - Oona`);
      }
    });
    this.handleSocketsNewMessage();
  }

  getMessages(): void {
    this.messageSrv.handleGetStreamMessages();
    this.messageSrv.handleGetPrivateMessages();

    setTimeout(() => {
      this.messageSrv.handleUnreadPrivateMessages();
      this.messageSrv.handleUnreadStreamMessages();
    }, 3000);
  }

  handleSocketsNewMessage(): void {
    let total = 0;
    this.sockets.allMsgCounterObservable.subscribe((newMessage) => {
      if (newMessage === 0) {
        return;
      } else {
        this.totalUnreadMsgSubject$.subscribe((unread) => {
          total = unread + newMessage;
        });
        this.totalUnreadMsgSubject$.next(total);
      }
    });
  }
}
