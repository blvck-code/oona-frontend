import { Component, OnInit } from '@angular/core';
// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../state/app.state';
import {getIsLoggedIn, usersLoaded} from '../auth/state/auth.selectors';
import * as messagingActions from '../dashboard/messaging/state/messaging.actions';
import * as authActions from '../auth/state/auth.actions';
import {streamsLoaded} from './messaging/state/messaging.selectors';
import {MessagingService} from './messaging/services/messaging.service';
import {OonaSocketService} from './messaging/services/oona-socket.service';
import {DashService} from './service/dash-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = 'Team Messaging';
  constructor(
    private store: Store<AppState>,
    private messageSrv: MessagingService,
    private oonaSockets: OonaSocketService,
    private dashSrv: DashService
  ) { }

  ngOnInit(): void {
    this.onInitHandler();
  }

  onInitHandler(): void {
    this.store.select(getIsLoggedIn).subscribe({
      next: (status: boolean) => {
        if (status) {
          this.dashSrv.onInitHandler();
        }
      }
    });
  }

  // initializeState(): void {
  //   // get streams
  //   this.store.dispatch(new messagingActions.LoadAllStreams());
  //   this.store.dispatch(new messagingActions.LoadSubStreams());
  //   // get users
  //   this.store.dispatch(new authActions.LoadPresentUsers());
  //   this.store.dispatch(new authActions.LoadZulipUsers());
  //   this.store.dispatch(new authActions.CurrentUserProfile());
  //
  //   // get stream messages
  //   this.store.select(streamsLoaded).subscribe({
  //     next: (status: boolean) => {
  //       if (status) {
  //         // todo get stream messages here after streams are loaded
  //         this.messageSrv.handleGetStreamMessages();
  //       }
  //     }
  //   });
  //
  //   // get Private messages
  //   this.store.select(usersLoaded).subscribe({
  //     next: (status: boolean) => {
  //       // Only get private messages when users are loaded
  //       if (status) {
  //         // this.messageSrv.handleGetPrivateMessages();
  //       }
  //     }
  //     });
  // }

}
