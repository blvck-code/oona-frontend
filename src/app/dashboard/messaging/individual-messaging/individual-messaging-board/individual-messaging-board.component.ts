import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {MessagingService} from '../../services/messaging.service';

import TurndownService from 'turndown';
import {OonaSocketService} from '../../services/oona-socket.service';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import {getSelectedUser} from '../../../../auth/state/auth.selectors';
import {BehaviorSubject, Observable} from 'rxjs';
// @Todo change this to fetch only individual messages
import {SingleMessageModel} from '../../models/messages.model';
import {take} from 'rxjs/operators';

const turndownService = new TurndownService();

@Component({
  selector: 'app-individual-messaging-board',
  templateUrl: './individual-messaging-board.component.html',
  styleUrls: ['./individual-messaging-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  messagesWithPerson = Array();
  messagesSubject$ = new BehaviorSubject<SingleMessageModel[]>(this.messagesWithPerson);
  messagesObserver = this.messagesSubject$.asObservable();


  @ViewChild('endPrivateChat') endPrivateChat: ElementRef | undefined;

  ngOnInit(): void {
    console.log('This component was initialized ASAP');
    this.getIndividualUser();
    this.changeContentOnRouteChange();
    this.incomingMessage();

    this.messagingService.currentMemberChatDetail.subscribe(member => {
      this.memberDetail = member;
      // this.store.dispatch(new authActions.SetSelectedUser(member));
      setTimeout(() => {
        this.privateMessages();
      }, 1000);
      });

    // always get the current value
    this.userSocketService.messageCount.subscribe(messages => {
      console.log('Sockets finally works ===>>>', messages);
      if (this.newMessagesCount !== messages){
        // get new messages
        this.privateMessages();
        this.newMessagesCount = messages;
      }
    });

    this.updateState();
  }

  // handleSocket(): void {
  //   this.userSocketService.
  // }

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private messagingService: MessagingService,
    private change: ChangeDetectorRef,
    private userSocketService: OonaSocketService,
  ) {

    this.store.select(getSelectedUser).subscribe(
      data => {
        if (data) {
          this.operand = data;
          this.getSelectedUser();
          console.log('User info content: ', data);
        }
      }
    );

  }

  changeContentOnRouteChange(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        console.log('Route change start');
        // this.getSelectedUser();
        // this.messages$ = this.store.select(getPrivateMessages);
        this.ngOnInit();
      }
    });
  }

  incomingMessage(): void {
      take(1),
      this.userSocketService.privateMessageSocket.subscribe(
        newMsgs => {
          newMsgs.map(msg => {
            this.messagesWithPerson.push(msg);
            this.change.detectChanges();
            this.scrollBottom();
            console.log('New messages list ===>>>', this.messagesWithPerson);
          });
        }
    );
  }

  getIndividualUser(): void {
    this.store.select(getSelectedUser).subscribe(
      user => {
        this.memberDetail = user;
        this.privateMessages();
        this.change.detectChanges();
      }
    );
  }

  getSelectedUser(): void {
    this.selectedUser$ = this.store.select(getSelectedUser);

    // get User Id
    this.store.select(getSelectedUser).subscribe(
      user => {
        this.selectedUserId = +user?.id;
      }
    );

    if (this.selectedUser$) {
      const streamDetail = {
        anchor: 'newest',
        apply_markdown: false,
        num_before: this.initialMessageCount,
        type: [
          {
            operator: 'pm-with',
            operand: this.operand?.email,
          }
        ]
      };

      this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
          console.log('Individual messages ===>>>', response);
          this.messagesSubject$.next(response?.zulip?.messages);
          this.messagesWithPerson = response?.zulip?.messages;
          this.change.detectChanges();
        } ,
        (error: any) => {
          console.log('Get Messages Error ===>>', error);
        });

      setTimeout(() => {
        this.scrollBottom();
      }, 500);
    }

    this.scrollBottom();
  }

  privateMessages(): void{
    const streamDetail = {
      use_first_unread_anchor: true,
      apply_markdown: false,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'pm-with',
          operand: this.memberDetail.email,
        }
      ]
    };

    this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
        console.log('Individual messages ===>>>', response);
        this.messagesSubject$.next(response?.zulip?.messages);

        this.scrollBottom();
        this.change.detectChanges();
      } ,
      (error: any) => {
        console.log('Get Messages Error ===>>', error);
      });
    this.userActiveStatus();

    setTimeout(() => {
      this.scrollBottom();
    }, 500);
    this.change.detectChanges();
  }

  sendMessageToIndividual(message: any): void {
    const markdown = turndownService.turndown(message);

    // let userId = this.selectedUserId
//
    // console.log('markdown', markdown);
    const messageDetail = {
      to: [this.operand?.user_id],
      content: markdown
    };
    console.log('Message final content ===>>> ', messageDetail);
    this.messagingService.sendIndividualMessage(messageDetail).subscribe((response: any) => {
      // re-fetch messages with pm
    });
    // this.privateMessages();

    const streamDetail = {
      use_first_unread_anchor: true,
      apply_markdown: false,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'pm-with',
          operand: this.operand?.email,
        }
      ]
    };
    // fetch messages after sending
    // this.store.dispatch(new messageActions.LoadPrivateMessages(streamDetail));
  }

  getIndividualMessage(): void {
    this.initialMessageCount = this.initialMessageCount + 10;
    const streamDetail = {
      use_first_unread_anchor: true,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'pm-with',
          operand: this.memberDetail.email,
        }
      ]
    };

    this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
        console.log('Messages by indivudual user ====>>>>', response);

        this.messagesWithPerson.unshift(... response.zulip.messages.slice(0, 10));
        this.change.detectChanges();
      } ,
      (error: any) => {
        console.log('error', error);
      });
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
        }
      ]
    };

    this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
        this.messagesWithPerson.unshift(... response.zulip.messages.slice(0, 10));
        this.change.detectChanges();
      } ,
      (error: any) => {
        console.log('error', error);
      });
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
        }
      ]
    };

    this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
        console.log('Latest update message ===>>>', response);
        // this.messagesWithPerson.unshift(... response.zulip.messages.slice(0, 10));
        this.change.detectChanges();
      } ,
      (error: any) => {
        console.log('error', error);
      });
    this.userActiveStatus();
  }

  updateState(): void {
    setInterval(() => {
      // this.getLatestMessage();
    }, 60000);
  }

  userActiveStatus(): void{
    this.messagingService.getUsersByAvailability().subscribe((users: { members: any[]; }) => {
      const usersPresent = users.members.filter(user => user?.presence );
      this.userActivity = usersPresent.find( user => user.email === this.memberDetail.email)?.presence.aggregated.status;
    });
  }

  scrollBottom(): any {
    // Todo Add scroll effect
    if (this.endPrivateChat) {
      this.endPrivateChat.nativeElement.scrollIntoView({ behavior: 'smooth'});
      // @ts-ignore
      // document.getElementById('box').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }
}
