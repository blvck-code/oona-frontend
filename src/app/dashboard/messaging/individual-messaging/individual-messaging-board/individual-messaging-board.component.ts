import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MessagingService} from '../../services/messaging.service';

import TurndownService from 'turndown';
import {OonaSocketService} from '../../services/oona-socket.service';
import {IndividualMessagingService} from '../individual-messaging.service';

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
  messagesWithPerson = Array();
  userActivity: any;
  initialMessageCount = 30;
  newMessagesCount = 0;
  createdAt: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messagingService: MessagingService,
    private change: ChangeDetectorRef,
    private userSocketService: OonaSocketService,
    ) {
   }

  ngOnInit(): void {
    this.messagingService.currentMemberChatDetail.subscribe(member => {
      this.memberDetail = member;
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
          this.messagesWithPerson = response.zulip.messages;
          // @ts-ignore
          document.getElementById('box').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          // this.sortMessageDates();
        } ,
        (error: any) => {
          console.log('error', error);
        });
      this.userActiveStatus();
  }

  sendMessageToIndividual(message: any): void {

    const markdown = turndownService.turndown(message);
//
    // console.log('markdown', markdown);
    const messageDetail = {
      to: [this.memberDetail.user_id],
      content: markdown
    };
    this.messagingService.sendIndividualMessage(messageDetail).subscribe((response: any) => {
      // re-fetch messages with pm
    });
    this.privateMessages();
  }

  userActiveStatus(): void{
    this.messagingService.getUsersByAvailability().subscribe((users: { members: any[]; }) => {
      const usersPresent = users.members.filter(user => user.presence );
      this.userActivity = usersPresent.find( user => user.email === this.memberDetail.email).presence.aggregated.status;
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
