import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

// NgRx
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import * as messagingActions from './state/messaging.actions';
import { MessagesSocketService } from './services/messages-socket.service';
import {getAllStreams, getPrivateUnread, getStreamsLoading} from './state/messaging.selectors';
import { map, take } from 'rxjs/operators';
import { AllStreamsModel } from './models/streams.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessagingService } from './services/messaging.service';
import * as sharedActions from '../../shared/state/shared.actions';
import * as authActions from '../../auth/state/auth.actions';
import { getAllUsers, getZulipUsers } from '../../auth/state/auth.selectors';
import { Title } from '@angular/platform-browser';
import { SingleMessageModel } from './models/messages.model';
import {ZulipSingleUser} from '../../auth/models/user.model';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss'],
  providers: [MessagesSocketService, MessagingService],
})
export class MessagingComponent implements OnInit {
  title = 'Team messaging';
  navTitle = '';
  firstName = '';
  secondName = '';
  streams!: Observable<AllStreamsModel[]>;
  allTopics: any = [];
  initialMessageCount = 30;
  rightPanelUsers = '';

  allUsers: any = [];
  allUsersSubject = new BehaviorSubject<any>(this.allUsers);
  // allUserObservable = this.allUsersSubject.asObservable();

  users$!: Observable<any>;
  unreadMessage$!: Observable<SingleMessageModel[]>;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private messageSocket: MessagesSocketService,
    private store: Store<AppState>,
    public messagingService: MessagingService,
  ) {
    // this.messageSocket.messageConnect();
    this.messagingService.messages.subscribe((msg) => {
      // console.log('Response from websocket ===>>>', msg);
    });
  }

  ngOnInit(): void {
    this.initPage();

    this.authService.getCurrentUser().subscribe((userData: any) => {
      this.firstName = userData.results[0].first_name;
      this.secondName = userData.results[0].last_name;
    });

    this.route.queryParams.subscribe((params) => {
      if (params.member || window.location.href.includes('private')) {
        this.navTitle = 'Private messaging';
      } else if (window.location.href.includes('mentions')) {
        this.navTitle = 'Messaging';
      } else {
        this.navTitle = 'Team messaging';
      }
    });
  }

  rightPanelTypeListener($event: any): void {
    this.rightPanelUsers = $event;
  }

  getAllMessages(): void {
    const streamDetail = {
      use_first_unread_anchor: true,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'stream',
          operand: 'general',
        },
      ],
    };
    this.store.dispatch(new messagingActions.LoadAllMessages(streamDetail));
  }

  getPrivateMessages(): void {
    this.store.select(getAllUsers).subscribe((users: any) => {
      users?.map((user: any) => {
        const streamDetail = {
          use_first_unread_anchor: true,
          num_before: this.initialMessageCount,
          type: [
            {
              operator: 'pm-with',
              operand: user?.email,
            },
          ],
        };

        this.store.dispatch(new messagingActions.LoadAllMessages(streamDetail));
      });
    });
  }

  initPage(): void {
    this.unreadMessage$ = this.store.select(getPrivateUnread);
    this.users$ = this.store.select(getZulipUsers);

    this.getUsersFromStore();
    // this.getUsers();
  }

  logoutUser(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getUsers(): void {
    const uniqueMsgId: number[] = [];
    const uniqueUserId: number[] = [];

    this.users$.subscribe(
      (users: ZulipSingleUser[]) => {
        users.map((user: ZulipSingleUser) => {
          // if (uniqueUserId.includes(user.user_id)) { return; }

          this.unreadMessage$.subscribe(
            (messages: SingleMessageModel[]) => {
              messages.map((message: SingleMessageModel) => {
                // if (uniqueMsgId.includes(message.id)) { return; }

                if (+message.sender_id === +user.user_id) {
                  console.log('Unread messages ==>>', message);
                  console.log('Unread messages ==>>', user);
                }

                // uniqueMsgId.push(message.id);
              });
            }
          );

          // uniqueUserId.push(user.user_id);
        });
      }
    );
  }

  getUsersFromStore(): void {

    take(1),
    this.store.select('userCenter').subscribe((userState: any) => {
      const allUserState = userState?.users?.all;
      this.allUsersSubject.next(allUserState?.members);
    });
  }
}
