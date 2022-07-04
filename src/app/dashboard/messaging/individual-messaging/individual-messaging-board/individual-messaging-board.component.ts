import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MessagingService} from '../../services/messaging.service';

import TurndownService from 'turndown';
import {OonaSocketService} from '../../services/oona-socket.service';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import * as messageActions from '../../state/messaging.actions';
import * as authActions from '../../../../auth/state/auth.actions';
import {getAllUsers, getSelectedUser} from '../../../../auth/state/auth.selectors';
import {Observable, Subscription} from 'rxjs';
 // @Todo change this to fetch only individual messages
import {getAllMessages, getFilteredPrvMsgs, getPrivateMessages} from '../../state/messaging.selectors';
import {LoadPrivateMessages} from '../../state/messaging.actions';

const turndownService = new TurndownService();

@Component({
  selector: 'app-individual-messaging-board',
  templateUrl: './individual-messaging-board.component.html',
  styleUrls: ['./individual-messaging-board.component.scss']
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
    email: undefined
  };
  messages$!: Observable<any>;
  selectedUser$!: Observable<any>;
  messagesWithPerson = Array();
  userActivity: any;
  initialMessageCount = 30;
  newMessagesCount = 0;
  @Input() currentMessages = [];
  createdAt: any;
  operand: any;

  ngOnInit(): void {
    // this.getUserInfo();

    this.messagingService.currentMemberChatDetail.subscribe(member => {
      this.memberDetail = member;
      // this.store.dispatch(new authActions.SetSelectedUser(member));
      setTimeout(() => {
        this.privateMessages();
      }, 1000);

    }); // always get the current value
    this.userSocketService.messageCount.subscribe(messages => {
      if (this.newMessagesCount !== messages){
        // get new messages
        this.privateMessages();
        this.newMessagesCount = messages;
      }
    });

  }

  // getUserInfo(): void {
  //   const userEmail = localStorage.getItem('privateMsg');
  //
  //   this.store.select(getAllUsers).subscribe(
  //     users => {
  //      const members = users?.members;
  //      members.forEach((member: any) => {
  //        if (member.email === userEmail){
  //          localStorage.setItem('privateMsg', member.email);
  //        }
  //      });
  //     }
  //   );
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
        }
      }
    );
  }

  getSelectedUser(): void {
    this.selectedUser$ = this.store.select(getSelectedUser);

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

    // fetch messages from server
    this.store.dispatch(new messageActions.LoadPrivateMessages(streamDetail));

    // get messages from store
    this.messages$ = this.store.select(getPrivateMessages);
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
      this.getSelectedUser();

      // @ts-ignore
      // document.getElementById('box').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });

      this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
          this.messagesWithPerson = response.zulip.messages;
          // @ts-ignore
          document.getElementById('box').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
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
  }

  userActiveStatus(): void{
    this.messagingService.getUsersByAvailability().subscribe((users: { members: any[]; }) => {
      const usersPresent = users.members.filter(user => user?.presence );
      this.userActivity = usersPresent.find( user => user.email === this.memberDetail.email)?.presence.aggregated.status;
    });
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
}
