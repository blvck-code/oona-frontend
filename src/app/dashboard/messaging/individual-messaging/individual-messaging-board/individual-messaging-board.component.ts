import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationStart, Params, Router} from '@angular/router';
import { MessagingService } from '../../services/messaging.service';

import TurndownService from 'turndown';
import { OonaSocketService } from '../../services/oona-socket.service';

// NgRx
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app.state';
import { getSelectedUser } from '../../../../auth/state/auth.selectors';
import { BehaviorSubject, Observable } from 'rxjs';
// @Todo change this to fetch only individual messages
import { SingleMessageModel } from '../../models/messages.model';
import { NotificationService } from '../../../../shared/services/notification.service';
import {
  getAllMessages,
  getPrivateMessages, getPrivateUser, getSelectedUserId,
  getSelectedUserMessages,
  getUnreadMessages, getUserUnreadMessages
} from '../../state/messaging.selectors';
import * as messagingActions from '../../state/messaging.actions';
import {log} from 'util';

const turndownService = new TurndownService();

@Component({
  selector: 'app-individual-messaging-board',
  templateUrl: './individual-messaging-board.component.html',
  styleUrls: ['./individual-messaging-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndividualMessagingBoardComponent implements OnInit {
  memberDetail = {
    full_name: undefined,
    bot_type: undefined,
    is_admin: undefined,
    is_active: undefined,
    user_id: undefined,
    is_bot: undefined,
    is_guest: undefined,
    avatar_url: undefined,
    email: undefined,
  };

  selectedUserId: any;
  currentUserId: any;

  selectedUser$!: Observable<any>;
  userActivity: any;
  initialMessageCount = 30;
  newMessagesCount = 0;
  @Input() currentMessages = [];
  createdAt: any;
  operand: any;

  loading = true;

  currentUser$!: Observable<any>;
  messages$!: Observable<SingleMessageModel[]>;

  messagesWithPerson = Array();
  messagesSubject$ = new BehaviorSubject<SingleMessageModel[]>(
    this.messagesWithPerson
  );
  messagesObserver = this.messagesSubject$.asObservable();

  unreadMessages: SingleMessageModel[] = [];
  unreadMessagesSubject = new BehaviorSubject<SingleMessageModel[]>(this.unreadMessages);
  unreadMessagesObservable = this.unreadMessagesSubject.asObservable();

  unreadMessagesId: number[] = [];
  unreadMessagesIdSubject = new BehaviorSubject<number[]>(this.unreadMessagesId);
  unreadMessagesIdObservable = this.unreadMessagesIdSubject.asObservable();

  messagesId: number[] = [];

  @ViewChild('endPrivateChat') endPrivateChat: ElementRef | undefined;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private messagingService: MessagingService,
    private change: ChangeDetectorRef,
    private userSocketService: OonaSocketService,
    private notify: NotificationService
  ) {
    this.store.select(getSelectedUser).subscribe((data) => {
      if (data) {
        this.selectedUserId = data.user_id;
        // this.getSelectedUser();
      }
    });
    this.routerDetails();
  }

  ngOnInit(): void {
    this.getIndividualUser();
    this.changeContentOnRouteChange();
    this.inComingMessage();
    this.resetDmUnreads();
    this.getUnreadMessages();
    this.getUserId();

    this.messages$ = this.store.select(getSelectedUserMessages);

    this.store.select(getSelectedUserMessages).subscribe(
      (messages: SingleMessageModel[]) => {
        this.loading = false;
      }
    );

    setTimeout(() => {
      this.currentUser$ = this.store.select(getPrivateUser);
      this.store.select(getPrivateUser).subscribe(
        (userInfo: any) => {
          this.selectedUserId = userInfo.user_id;
          this.operand = userInfo;
        }
      );
    }, 1000);


    this.messagingService.currentMemberChatDetail.subscribe((member) => {
      this.memberDetail = member;
      this.selectedUserId = member.user_id;
      // this.store.dispatch(new authActions.SetSelectedUser(member));
      setTimeout(() => {
        this.privateMessages();
      }, 1000);
    });

    // always get the current value
    this.userSocketService.messageCount.subscribe((messages) => {
      if (this.newMessagesCount !== messages) {
        this.newMessagesCount = messages;
      }
    });

    this.updateState();
  }

  getUserId(): void {
    this.store.select(getPrivateUser).subscribe(
      (user: any) => console.log('User details challenge ==>>>', user)
    );
  }

  getUnreadMessages(): void {
    const unreadMessageId: number[] = [];

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.store.select(getUserUnreadMessages).subscribe(
          (messages: SingleMessageModel[]) => {
            messages.map((message: SingleMessageModel) => {
              if (unreadMessageId.includes(message.id)) { return; }

              this.messagingService.updateMessageFlag(message.id).subscribe(
                (response: any) => {
                  const messageId = response.messages[0];
                  this.store.dispatch(new messagingActions.UpdatePrivateMessageFlag(messageId));
                }
              );

            });
          }
        );
      }

    });
  }

  routerDetails(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const userId = params.id;
      this.currentUserId = params.id;
      this.store.dispatch(new messagingActions.SelectedUserId(+userId));
    });
  }

  changeContentOnRouteChange(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        console.log('Route change start');
        // this.ngOnInit();
        this.getSelectedUser();
      }
    });
  }

  getIndividualUser(): void {
    this.store.select(getSelectedUser).subscribe((user) => {
      this.memberDetail = user;
      this.selectedUserId = user.user_id;
      this.privateMessages();
      this.change.detectChanges();
    });
  }

  getSelectedUser(): void {
    this.selectedUser$ = this.store.select(getSelectedUser);

    // get User Id
    this.store.select(getSelectedUser).subscribe((user) => {
      this.selectedUserId = +user?.id;
    });

    if (this.selectedUser$) {
      const streamDetail = {
        anchor: 'newest',
        apply_markdown: false,
        num_before: this.initialMessageCount,
        type: [
          {
            operator: 'pm-with',
            operand: this.operand?.email,
          },
        ],
      };

      this.messagingService.getMessagesOfStream(streamDetail).subscribe(
        (response: any) => {
          this.loading = false;
          const messages = response.zulip.messages;
          this.messagesWithPerson = messages;
          this.messagesSubject$.next(messages);
          this.updateMessageId();
          this.change.detectChanges();
        },
        (error: any) => {
          console.log('Get Messages Error ===>>', error);
        }
      );

      setTimeout(() => {
        this.scrollBottom();
      }, 500);
    }

    this.scrollBottom();
  }


  privateMessages(): void {

    const streamDetail = {
      use_first_unread_anchor: true,
      apply_markdown: false,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'pm-with',
          operand: this.operand?.email,
        },
      ],
    };

    this.messagingService.getMessagesOfStream(streamDetail).subscribe(
      (response: any) => {
        // console.log('Individual messages ===>>>', response);

        this.scrollBottom();
        this.change.detectChanges();
      },
      (error: any) => {
        console.log('Get Messages Error ===>>', error);
      }
    );
    this.userActiveStatus();
    this.change.detectChanges();
  }

  updateMessageId(): void {
    this.messagesWithPerson.forEach((message) =>
      this.messagesId.push(message.id)
    );
  }

  inComingMessage(): void {
    this.userSocketService.privateMessageCountSocket.subscribe((prvMsg) => {
      console.log(
        'Unread messages for particular user dm ===>>>',
        prvMsg.length
      );
      prvMsg.map((msg) => {
        if (this.messagesId.includes(msg.id)) {
          return;
        }

        this.messagesId.push(msg.id);
        this.messagesWithPerson.push(msg);
        this.change.detectChanges();
        this.scrollBottom();
      });
    });
  }

  outGoingMsg(): void {
    this.userSocketService.myMessagesSocketSubject.subscribe((msg: any) => {
      this.messagesSubject$.subscribe((messages) => {
        if (this.messagesId.includes(msg.id)) {
          return;
        }

        if (!msg.id) {
          return;
        }

        this.messagesId.push(msg.id);
        messages.push(msg);
        this.change.detectChanges();
        this.scrollBottom();
      });
    });
  }

  // resets unread messages to zero when page in loaded
  resetDmUnreads(): void {
    this.userSocketService.privateMessageSocket.subscribe((newMessage) => {
      const dmMsg = newMessage.filter(
        (msg) => +msg.sender_id === +this.operand?.user_id
      );
      newMessage.map((msg) => {
        if (msg.sender_id === +this.operand?.user_id) {
          newMessage.splice(msg);
        }
      });
      this.userSocketService.privateMessageSocket.subscribe((messages) =>
        console.log('After updating messages in array ===>>>>', messages)
      );
    });
  }

  sendMessageToIndividual(message: any): void {

    const markdown = turndownService.turndown(message);
    const messageDetail = {
      to: [this.operand?.user_id],
      content: markdown,
    };
    console.log('Message final content ===>>> ', messageDetail);
    // Todo uncomment to send message to backend
    this.messagingService.sendIndividualMessage(messageDetail).subscribe(
      (response: any) => {
        this.outGoingMsg();
      },
      // (response: any) => { this.outGoingMsg(); },
      (error: any) => {
        this.notify.showError(
          'Your message could not be sent, please try again.',
          'Sending message error'
        );
      }
    );

  }


  getMorePrivateMessages(): void {
    this.initialMessageCount = this.initialMessageCount + 10;
    const streamDetail = {
      use_first_unread_anchor: true,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'pm-with',
          operand: this.operand?.email,
        },
      ],
    };

    this.messagingService.getMessagesOfStream(streamDetail).subscribe(
      (response: any) => {
        this.messagesWithPerson.unshift(
          ...response.zulip.messages.slice(0, 10)
        );
        this.change.detectChanges();
      },
      (error: any) => {
        console.log('error', error);
      }
    );
    this.userActiveStatus();
  }

  getLatestMessage(): void {
    const streamDetail = {
      anchor: 'newest',
      num_before: 30,
      type: [
        {
          operator: 'pm-with',
          operand: this.operand?.email,
        },
      ],
    };

    this.messagingService.getMessagesOfStream(streamDetail).subscribe(
      (response: any) => {
        console.log('Latest update message ===>>>', response);
        // this.messagesWithPerson.unshift(... response.zulip.messages.slice(0, 10));
        this.change.detectChanges();
      },
      (error: any) => {
        console.log('error', error);
      }
    );
    this.userActiveStatus();
  }

  updateState(): void {
    setInterval(() => {
      // this.getLatestMessage();
    }, 60000);
  }

  userActiveStatus(): void {
    this.messagingService
      .getUsersByAvailability()
      .subscribe((users: { members: any[] }) => {
        const usersPresent = users.members.filter((user) => user?.presence);
        this.userActivity = usersPresent.find(
          (user) => user.email === this.memberDetail.email
        )?.presence.aggregated.status;
      });
  }

  scrollBottom(): any {
    // Todo Add scroll effect
    if (this.endPrivateChat) {
      this.endPrivateChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      // @ts-ignore
      // document.getElementById('box').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }
}
