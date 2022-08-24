import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {ActivatedRoute, NavigationStart, Params, Router} from '@angular/router';
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
import {map, take} from 'rxjs/operators';
import { NotificationService } from '../../../../shared/services/notification.service';
import { numbers } from '@material/dialog/constants';
import { getAllMessages } from '../../state/messaging.selectors';
import {log} from "util";

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
  selectedUser$!: Observable<any>;
  userActivity: any;
  initialMessageCount = 30;
  newMessagesCount = 0;
  @Input() currentMessages = [];
  createdAt: any;
  operand: any;
  loading = false;

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
  unreadMessagesIdObservable = this.unreadMessagesIdSubject.asObservable()

  messagesId: number[] = [];

  @ViewChild('endPrivateChat') endPrivateChat: ElementRef | undefined;

  ngOnInit(): void {
    this.getIndividualUser();
    this.changeContentOnRouteChange();
    this.inComingMessage();
    this.resetDmUnreads();
    // this.getPrivateMessageFromStore();

    this.messagingService.currentMemberChatDetail.subscribe((member) => {
      this.memberDetail = member;
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
        this.operand = data;
        this.selectedUserId = data.user_id;
        this.getSelectedUser();
      }
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
          const messages = response.zulip.messages;
          this.messagesWithPerson = messages;
          this.messagesSubject$.next(messages);
          this.updateMessageId();
          this.change.detectChanges();
          this.handleUnreadMessages();
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

  handleUnreadMessages(): void {
    const unreadMsgArray: any[] = [];
    const unreadMsgId: any[] = [];
    const userId = this.operand.user_id;

    this.messagesSubject$.subscribe((messages: SingleMessageModel[]) => {
      messages.map((message: SingleMessageModel) => {


        if(+message.sender_id === +userId){

          if(message.flags.includes('read')){
            return
          } else {
            unreadMsgArray.push(message);
            unreadMsgId.push(message.id)
          }
          this.unreadMessagesSubject.next(unreadMsgArray);
          this.unreadMessagesIdSubject.next(unreadMsgId);
          this.updateReadMessages();
        }
      })
    })
  }


  updateReadMessages(): void {
    // update private messages to read
    this.unreadMessagesIdObservable.subscribe((id: number[]) => {
      if(id.length) {
        this.messagingService.updateReadMessagesFlags('private', id).subscribe((response: any) => {
          console.log('Updates successfully', response)
        })
      }
    })
  }

  privateMessages(): void {
    this.loading = true;

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
        this.loading = false;

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
      console.log('Before updating messages in array ===>>>>', newMessage);
      const dmMsg = newMessage.filter(
        (msg) => +msg.sender_id === +this.operand?.user_id
      );
      newMessage.map((msg) => {
        if (msg.sender_id === +this.operand?.user_id) {
          newMessage.splice(msg);
        }
      });
      console.log('This users dm message ===>>>', dmMsg);
      console.log('Length of this dm messages ===>>>', dmMsg.length);

      this.userSocketService.privateMessageSocket.subscribe((messages) =>
        console.log('After updating messages in array ===>>>>', messages)
      );
    });
  }

  sendMessageToIndividual(message: any): void {
    const markdown = turndownService.turndown(message);

    // let userId = this.selectedUserId
    //
    // console.log('markdown', markdown);
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
  }

  getIndividualMessage(): void {
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

  getPrivateMessageFromStore(): void {
    this.store
      .select(getAllMessages)
      .subscribe((messages: SingleMessageModel[]) => {
        const msgs = messages?.find(
          (message) => +message.sender_id === +this.selectedUserId
        );

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
