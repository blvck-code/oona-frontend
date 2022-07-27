import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {MessagingService} from '../../services/messaging.service';

import TurndownService from 'turndown';
import {OonaSocketService} from '../../services/oona-socket.service';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import * as messageActions from '../../state/messaging.actions';
import {getSelectedUser} from '../../../../auth/state/auth.selectors';
import {Observable} from 'rxjs';
// @Todo change this to fetch only individual messages
import {getPrivateMessages} from '../../state/messaging.selectors';

const turndownService = new TurndownService();

@Component({
  selector: 'app-individual-messaging-board',
  templateUrl: './individual-messaging-board.component.html',
  styleUrls: ['./individual-messaging-board.component.scss'],
})
export class IndividualMessagingBoardComponent implements OnInit, AfterViewInit {
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
  messages$!: Observable<any>;
  selectedUserId: any;
  selectedUser$!: Observable<any>;
  messagesWithPerson = Array();
  userActivity: any;
  initialMessageCount = 30;
  newMessagesCount = 0;
  @Input() currentMessages = [];
  createdAt: any;
  operand: any;

  @ViewChild('endPrivateChat') endPrivateChat: ElementRef | undefined;

  ngOnInit(): void {
    this.getIndividualUser();
    // this.changeContentOnRouteChange();

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
    // @ts-ignore
    this.route.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        console.log('Route change start');
        // this.getSelectedUser();
        this.messages$ = this.store.select(getPrivateMessages);
      }
    });
  }

  getIndividualUser(): void {
    this.store.select(getSelectedUser).subscribe(
      user => {
        this.memberDetail = user;
        this.privateMessages();
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
          this.messagesWithPerson = response?.zulip?.messages;
          this.scrollBottom();
          // @ts-ignore
          // document.getElementById('box').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          // this.sortMessageDates();
        } ,
        (error: any) => {
          console.log('Get Messages Error ===>>', error);
        });

    }

    // get messages from store
    this.messages$ = this.store.select(getPrivateMessages);

    this.store.select(getPrivateMessages).subscribe(
      (response: any) => {
        console.log('Messages with the person ====>>>', response);

        // this.messagesWithPerson = response.zulip.messages;
        this.messagesWithPerson = response;
      }
    );
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

    // get Selected User
    // this.getSelectedUser();

    this.scrollBottom();
    // @ts-ignore
    // document.getElementById('box').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });

    this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
        console.log('Individual messages ===>>>', response);
        this.messagesWithPerson = response.zulip.messages;
        // @ts-ignore
        this.scrollBottom();
        // document.getElementById('box').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        // this.sortMessageDates();
      } ,
      (error: any) => {
        console.log('Get Messages Error ===>>', error);
      });
    this.userActiveStatus();
  }

  sendMessageToIndividual(message: any): void {
    console.log('Message content ==>>> ', message);

    const markdown = turndownService.turndown(message);
//
    // console.log('markdown', markdown);
    const messageDetail = {
      to: [this.memberDetail.user_id],
      content: markdown
    };
    console.log('Message final content ===>>> ', messageDetail);
    this.messagingService.sendIndividualMessage(messageDetail).subscribe((response: any) => {
      // re-fetch messages with pm
    });
    this.privateMessages();

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
    this.store.dispatch(new messageActions.LoadPrivateMessages(streamDetail));
  }

  userActiveStatus(): void{
    this.messagingService.getUsersByAvailability().subscribe((users: { members: any[]; }) => {
      const usersPresent = users.members.filter(user => user?.presence );
      this.userActivity = usersPresent.find( user => user.email === this.memberDetail.email)?.presence.aggregated.status;
    });
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
          operand: this.memberDetail.email,
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

  ngAfterViewInit(): void {
    if (this.messagesWithPerson.length) {
      this.scrollBottom();
    }
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

  scrollBottom(): any {
    // Todo Add scroll effect
    if (this.endPrivateChat) {
      this.endPrivateChat.nativeElement.scrollIntoView({ behavior: 'smooth'});
      // @ts-ignore
      // document.getElementById('box').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }
}
