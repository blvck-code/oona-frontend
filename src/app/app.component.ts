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

import { OneSignal} from 'onesignal-ngx';
import {MessagingService} from "./dashboard/messaging/services/messaging.service";

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
    private oneSignal: OneSignal
  ) {
  }

  updateState = () => {

    this.store.dispatch(new authActions.UpdateState());

    this.store.select(getIsLoggedIn).subscribe(
      status => {
        console.log('Is logged in? ', status);
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

        console.log('Latest message content ====>>', messages);
        console.log('Messages counter ===>>> ', newMessage);
      }
    );
  }

  ngOnInit(): void {
    this.updateState();
    // this.tabNotification();
    // this.updateTabNotification();
  }

  updateTabNotification(): void {
    this.messageSrv.totalUnreadMsgCounterObservable.subscribe(
      msg => {
        if (msg > 0) {
          this.titleService.setTitle(`(${msg}) - AVL - Oona`);
          // document.title = `(${msg}) - AVL - Oona`;
        } else {
          this.titleService.setTitle(`AVL - Oona`);
        }
      }
    )
  }

  // handleSocketsNewMessage(): void {
  //   this.userSocketService.allMsgCounterObservable.subscribe(
  //     newMessage => {
  //       if(newMessage === 0) {
  //         return
  //       } else {
  //         // update all messages counter
  //         const newTotal = this.totalUnreadMsg += 1;
  //         this.totalUnreadMsgSubject$.next(newTotal);
  //
  //         // update private messages counter
  //         const newTotalPrivateMsg = this.privateUnreadMsgCounter += 1;
  //         this.privateUnreadMsgCounterSubject.next(newTotalPrivateMsg);
  //       }
  //     }
  //   );
  // }

  handleWebPush(): void {
    this.oneSignal.init({
      appId: '41d455ec-e448-416c-a089-c8ac0ebb5f4d'
    });
  }

}
