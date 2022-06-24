import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../state/app.state';
import * as messagingActions from './state/messaging.actions';
import {MessagesSocketService} from './services/messages-socket.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit {
  title = 'Team messaging';
  navTitle = '';
  firstName = '';
  secondName = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private messageSocket: MessagesSocketService,
    private store: Store<AppState>
  ) {
    this.messageSocket.messageConnect();
  }

  ngOnInit(): void {
    this.initPage();

    this.authService.getCurrentUser().subscribe(
      (userData: any) => {
        this.firstName = userData.results[0].first_name;
        this.secondName = userData.results[0].last_name;
      }
    );

    this.route.queryParams
      .subscribe(params => {
        if (params.member || window.location.href.includes('private')){
          this.navTitle = 'Private messaging';
        }else if (window.location.href.includes('mentions')){
          this.navTitle = 'Messaging';
        } else{
          this.navTitle = 'Team messaging';
        }
        }
      );

  }

  initPage(): void{
    this.store.dispatch(new messagingActions.LoadAllStreams());
    this.store.dispatch(new messagingActions.LoadSubStreams());
  }

  logoutUser(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
