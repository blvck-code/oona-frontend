import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MessagingService} from '../../services/messaging.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-group-pms-messaging-board',
  templateUrl: './group-pms-messaging-board.component.html',
  styleUrls: ['./group-pms-messaging-board.component.scss']
})
export class GroupPmsMessagingBoardComponent implements OnInit {
  allUsers = Array();
  messagesWithIndividuals = Array();
  loggedUserProfile: any;
  initialMessageCount =  20;

  constructor(
    private messagingService: MessagingService,
    private router: Router,
    private change: ChangeDetectorRef
  ) {this.userProfileDetail(); }

  ngOnInit(): void {
  }
  userProfileDetail(): void {
    this.messagingService.currentUserProfile().subscribe((loggedUser: any) => {
      this.loggedUserProfile = loggedUser;
      this.getAllGroupChats(loggedUser);
    });
  }

  getAllGroupChats(loggedUser: any): void{
      const streamDetail = {
        use_first_unread_anchor: true,
        apply_markdown: false,
        num_before: this.initialMessageCount,
        type: [
          {
            operator: 'group-pm-with',
            operand: loggedUser.zulip.email,
          }
        ]
      };
      this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
          const allMessages = response.zulip.messages;
          if (allMessages.length >= 1){
            this.messagesWithIndividuals.push(... allMessages);
            // sort by timestamp
            this.messagesWithIndividuals.sort((a, b) =>  a.timestamp - b.timestamp );
            this.change.detectChanges();
            // @ts-ignore
            document.getElementById('box').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          }
        } ,
        (error: any) => {
          console.log('error', error);
        });
  }

  getMorePrivateMessages(): void {
    this.initialMessageCount = this.initialMessageCount + 10;
    const streamDetail = {
      use_first_unread_anchor: true,
      apply_markdown: false,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'group-pm-with',
          operand: this.loggedUserProfile.zulip.email,
        }
      ]
    };

    this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
        const allMessages = response.zulip.messages;
        if (allMessages.length >= 1){
          this.messagesWithIndividuals.unshift(... allMessages.slice(0, 10));
          this.change.detectChanges();
        }
      } ,
      (error: any) => {
        console.log('error', error);
      });
  }

}
