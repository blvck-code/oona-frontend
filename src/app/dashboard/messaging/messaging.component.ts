import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

// NgRx
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import * as messagingActions from './state/messaging.actions';
import { MessagesSocketService } from './services/messages-socket.service';
import { getAllStreams, getStreamsLoading } from './state/messaging.selectors';
import { map, take } from 'rxjs/operators';
import { AllStreamsModel } from './models/streams.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessagingService } from './services/messaging.service';
import * as sharedActions from '../../shared/state/shared.actions';
import * as authActions from '../../auth/state/auth.actions';
import { getAllUsers, getZulipUsers } from '../../auth/state/auth.selectors';
import { Title } from '@angular/platform-browser';
import { SingleMessageModel } from './models/messages.model';

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

  allUsers: any = [];
  allUsersSubject = new BehaviorSubject<any>(this.allUsers);
  allUserObservable = this.allUsersSubject.asObservable();

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
    // this.initializeState();
    this.getAllMessages();
    this.getPrivateMessages();
    this.getUsersFromStore();
    this.getAllPrivateMessages();
    // this.getStreamData();
  }

  initializeState(): void {
    this.store.dispatch(new messagingActions.LoadAllStreams());
    this.store.dispatch(new messagingActions.LoadSubStreams());
    this.store.dispatch(new authActions.LoadZulipUsers());
    this.store.dispatch(new authActions.LoadAllUsers());
  }

  logoutUser(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // get streams for left handle
  getStreamsTopics(): void {
    this.streams = this.store.select(getAllStreams);

    this.store.select(getAllStreams).subscribe((streams) => {
      take(streams.length),
        streams.map((stream: AllStreamsModel) => {
          const streamId = stream?.stream_id;

          take(1),
            this.messagingService
              .getTopicsOnStreams(stream.stream_id)
              .subscribe(
                // tslint:disable-next-line:no-shadowed-variable
                (data: any) => {
                  const topicId = data?.oz?.stream_id;
                  if (topicId === streamId) {
                    stream = {
                      ...stream,
                      topics: data,
                    };
                    this.allTopics = [...this.allTopics, stream];
                  }
                }
              );
          // this.store.dispatch(new messagingActions.LoadStreamTopic(item.stream_id));
          // this.streamIds = [...this.streamMessages, item.stream_id];
        });
    });
  }

  // get stream content
  getStreamData(): void {
    this.store.select(getAllStreams).subscribe((streams) => {
      streams.map((stream: any) => {
        const streamName = stream?.name;

        const streamDetails = {
          anchor: 'newest',
          num_before: 10,
          type: [
            {
              operator: 'stream',
              operand: streamName,
            },
          ],
        };

        this.store.dispatch(new messagingActions.LoadStreamData(streamDetails));
      });
    });
  }

  getAllStreamData(): void {
    this.store.select(getAllStreams).subscribe((streams: any) => {
      streams?.map((stream: any) => {
        const streamDetail = {
          anchor: 'newest',
          num_before: 100,
          num_after: 0,
          type: [
            {
              operator: 'stream',
              operand: stream?.name,
            },
          ],
        };

        this.messagingService
          .getMessagesOfStream(streamDetail)
          .subscribe((response: any) => {
            const messages = response?.zulip?.messages;

            messages?.forEach((msg: SingleMessageModel) => {
              if (msg) {
                this.store.dispatch(new messagingActions.HandleStreamData(msg));
              }
            });
          });
      });
    });
  }

  getAllPrivateMessages(): void {
    this.store.select(getAllUsers).subscribe((users) => {
      users?.map((user: any) => {
        const streamDetail = {
          anchor: 'newest',
          num_before: 100,
          num_after: 0,
          type: [
            {
              operator: 'pm-with',
              operand: user?.email,
            },
          ],
        };

        this.messagingService
          .getMessagesOfStream(streamDetail)
          .subscribe((response: any) => {
            const messages = response?.zulip?.messages;

            if(!messages.length){
              return
            }
            messages?.forEach((msg: SingleMessageModel) => {
              if (msg) {
                // this.privateMessages.push(msg);
                // this.sortMessages();
                this.store.dispatch(new messagingActions.LoadAllMessagesSuccess(msg))
              }
            });
          });
      });
    });
  }

  getUsersFromStore(): void {
    // console.log('Getting users from store');

    take(1),
      this.store.select('userCenter').subscribe((userState: any) => {
        const allUserState = userState?.users?.all;
        this.allUsersSubject.next(allUserState?.members);
      });
  }
}
