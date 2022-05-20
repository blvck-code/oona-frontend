import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {MessagingService} from '../../messaging.service';

@Component({
  selector: 'app-landing-message-board',
  templateUrl: './landing-message-board.component.html',
  styleUrls: ['./landing-message-board.component.scss']
})
export class LandingMessageBoardComponent implements OnInit {
  allTeams = Array();
  messagesOfStream = Array();
  initialMessageCount =  30;

  constructor(
    private messagingService: MessagingService,
    private change: ChangeDetectorRef
  ) {
    this.allMemberTeams();
  }

  ngOnInit(): void {
    setTimeout( () => {this.getMessagesOfTeams(); }, 1000);
  }

  allMemberTeams(): void{
    this.messagingService.getAllTeams().subscribe((teams: any) => {
      this.allTeams = teams.streams.map((team: { name: any; }) => team.name);
    });
  }

  getMessagesOfTeams(): void{
    // get messages of each team
    this.allTeams.forEach( (teamName: any) => {
      const streamDetail = {
        use_first_unread_anchor: true,
        num_before: this.initialMessageCount,
        type: [
          {
            operator: 'stream',
            operand: teamName
          }
        ]
      };
      this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
        this.change.detectChanges();
        this.messagesOfStream.push(...response.zulip.messages);
        // sort by time. latest last
        this.messagesOfStream.sort((a, b) =>  a.timestamp - b.timestamp );
        this.change.detectChanges();
        // @ts-ignore
        document.getElementById('box').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        } ,
        (error: any) => {
          console.log('error', error);
        });
    });

  }

  getMorePrivateMessages(): void {
    this.initialMessageCount = this.initialMessageCount + 10;
    // get messages of each team
    this.allTeams.forEach( (teamName: any) => {
      const streamDetail = {
        use_first_unread_anchor: true,
        num_before: this.initialMessageCount,
        type: [
          {
            operator: 'stream',
            operand: teamName
          }
        ]
      };
      this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
          this.change.detectChanges();
          // get first 10 items from this new array array.slice(0, 10);
          // add the 10 items to the top of the stack
          this.messagesOfStream.unshift(...response.zulip.messages.slice(0, 10));
          // sort by time. latest last
          // this.messagesOfStream.sort((a, b) =>  a.timestamp - b.timestamp );
          this.change.detectChanges();
        } ,
        (error: any) => {
          console.log('error', error);
        });
    });
  }


}
