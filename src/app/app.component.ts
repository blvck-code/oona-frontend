import {Component, OnInit} from '@angular/core';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from './state/app.state';
import * as authActions from './auth/state/auth.actions';
import * as sharedActions from './shared/state/shared.actions';
import {getIsLoggedIn} from './auth/state/auth.selectors';
import {OonaSocketService} from './dashboard/messaging/services/oona-socket.service';
import {ActivatedRoute} from '@angular/router';

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
    private route: ActivatedRoute,
  ) {
  }

  updateState = () => {
    // if (localStorage.getItem('accessToken')){
    //
    //   // this.store.dispatch(new sharedActions.LoadUsers());
    // }
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
    let unreadMessages = 0;

    this.sockets.messageCount.subscribe(
      (unreadMsg: number) => {
        unreadMsg > 0 ? unreadMessages = unreadMsg : null;
      }
    );
  }

  ngOnInit(): void {
    this.updateState();
    this.tabNotification();
  }

}
