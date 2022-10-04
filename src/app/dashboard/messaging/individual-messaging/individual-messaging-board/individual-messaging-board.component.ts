import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { MessagingService } from '../../services/messaging.service';

import TurndownService from 'turndown';
import { OonaSocketService } from '../../services/oona-socket.service';

// NgRx
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app.state';
import {getSelectedUser, getUserId} from '../../../../auth/state/auth.selectors';
import { BehaviorSubject, Observable } from 'rxjs';
// @Todo change this to fetch only individual messages
import { SingleMessageModel } from '../../models/messages.model';
import { NotificationService } from '../../../../shared/services/notification.service';
import {
  getPrivateUser,
  getSelectedUserMessages,
  getUserUnreadMessages
} from '../../state/messaging.selectors';
import * as messagingActions from '../../state/messaging.actions';

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
  @Input() currentMessages = [];
  operand: any;

  loading = true;

  currentUser$!: Observable<any>;
  currentUserId$!: Observable<number>;
  messages$!: Observable<SingleMessageModel[]>;

  messagesWithPerson = Array();
  messagesSubject$ = new BehaviorSubject<SingleMessageModel[]>(
    this.messagesWithPerson
  );

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
      }
    });
    this.routerDetails();
  }

  ngOnInit(): void {
    // this.inComingMessage();
    this.resetDmUnreads();
    this.getUnreadMessages();
    this.store.select(getSelectedUserMessages).subscribe(
      () => {
        this.loading = false;
      }
    );

    this.messages$ = this.store.select(getSelectedUserMessages);

    this.currentUser$ = this.store.select(getPrivateUser);
    this.currentUserId$ = this.store.select(getUserId);
    this.store.select(getPrivateUser).subscribe(
      (userInfo: any) => {
        this.selectedUserId = userInfo.user_id;
        this.operand = userInfo;
      }
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

  // resets unread messages to zero when page in loaded
  resetDmUnreads(): void {
    this.userSocketService.privateMessageSocket.subscribe((newMessage) => {
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
      () => {
      },
      () => {
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
    }
  }
}
