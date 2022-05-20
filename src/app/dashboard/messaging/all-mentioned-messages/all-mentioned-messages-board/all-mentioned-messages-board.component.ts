import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MessagingService} from '../../messaging.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-all-mentioned-messages-board',
  templateUrl: './all-mentioned-messages-board.component.html',
  styleUrls: ['./all-mentioned-messages-board.component.scss']
})
export class AllMentionedMessagesBoardComponent implements OnInit {

  mentionsWithIndividuals = new Array();
  loggedInUserProfile: any;
  initialMessageCount =  10;

  constructor(
    private messagingService: MessagingService,
    private router: Router,
    private change: ChangeDetectorRef
  ) {
    this.userProfile();
  }

  ngOnInit(): void {
    // setTimeout(() => {
    // this.getAllMentions();
    // }, 1000);
  }

  userProfile(): any{
    this.messagingService.currentUserProfile().subscribe((profile: any) => {
      this.loggedInUserProfile = profile.zulip;
      this.getAllMentions(profile.zulip.full_name);
    });
  }

  private getAllMentions(userName: string): void {
    const messageDetail = {
      use_first_unread_anchor: true,
      apply_markdown: false,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'search',
          operand: userName,
        }
      ]
    };

    this.messagingService.getMessagesOfStream(messageDetail).subscribe( (response: any) => {
        const allMessages = response.zulip.messages;
        if (allMessages.length >= 1){
          this.mentionsWithIndividuals.push(... allMessages);
          // sort by timestamp
          this.mentionsWithIndividuals.sort((a, b) =>  a.timestamp - b.timestamp );
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
    const messageDetail = {
      use_first_unread_anchor: true,
      apply_markdown: false,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'search',
          operand: this.loggedInUserProfile.full_name,
        }
      ]
    };

    this.messagingService.getMessagesOfStream(messageDetail).subscribe( (response: any) => {
        const allMessages = response.zulip.messages;
        if (allMessages.length >= 1){
          this.mentionsWithIndividuals.unshift(... allMessages.slice(0, 10));
          this.change.detectChanges();
        }
      } ,
      (error: any) => {
        console.log('error', error);
      });
  }
}
