import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MessagingService} from '../../services/messaging.service';
import {Router} from '@angular/router';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import {getLoadingMsg, getMessages} from '../../state/messaging.selectors';
import * as messageActions from '../../state/messaging.actions';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-all-private-messages-board',
  templateUrl: './all-private-messages-board.component.html',
  styleUrls: ['./all-private-messages-board.component.scss']
})
export class AllPrivateMessagesBoardComponent implements OnInit {
  allUsers = Array();
  messagesWithIndividuals = Array();
  @Output() pmMemberNames = new EventEmitter<any>();
  initialMessageCount = 10;
  messages$!: Observable<any>;
  loadingMessages!: Observable<boolean>;

  constructor(
    private messagingService: MessagingService,
    private router: Router,
    private change: ChangeDetectorRef,
    private store: Store<AppState>
  ) {
    this.allUsersRegistered();
  }

  ngOnInit(): void {
    this.initPage();
  }

  // Init page
  initPage() {

    const streamDetail = {
      use_first_unread_anchor: true,
      apply_markdown: false,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'pm-with',
          // change to user.email
          operand: 'maurice.oluoch@8teq.co.ke',
        }
      ]
    };

    // get Loading Message
    this.loadingMessages = this.store.select(getLoadingMsg);

    // fetch messages if not exist any
    this.store.select(getMessages).subscribe(
      messages => {
        if (!messages){
          // ToDo this should change on the change of operator and operand
          this.store.dispatch(new messageActions.LoadMessaging(streamDetail));
        } else if (messages && !this.messages$) {
          this.messages$ = this.store.select(getMessages);
        } else {
          this.messages$ = this.store.select(getMessages);
        }
      }
    );
  }

  allUsersRegistered(): void {
    this.messagingService.getUsersByAvailability().subscribe((users: { members: any[]; }) => {
      const usersPresent = users.members.filter(user => user.presence );
      this.allUsers = this.messagingService.newListOfUsers(usersPresent);
    });
    setTimeout( () => {
    this.getAllPrivateChats();
    }, 1000);
  }

  getAllPrivateChats(): void{
    this.allUsers.forEach( user => {
      const streamDetail = {
        use_first_unread_anchor: true,
        apply_markdown: false,
        num_before: this.initialMessageCount,
        type: [
          {
            operator: 'pm-with',
            operand: user.email,
          }
        ]
      };
      this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
        const allMessages = response.zulip.messages;
        console.log('All messages', allMessages);
        if (allMessages.length >= 1){
          this.messagesWithIndividuals.push(... allMessages);
          // tslint:disable-next-line:max-line-length
          this.messagingService.changePmNames(
            this.messagesWithIndividuals.map(individualMessage => individualMessage.display_recipient)
          );
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
    });
  }

  getMorePrivateMessages(): void {
    this.initialMessageCount = this.initialMessageCount + 10;
    this.allUsers.forEach( user => {
      const streamDetail = {
        use_first_unread_anchor: true,
        apply_markdown: false,
        num_before: this.initialMessageCount,
        type: [
          {
            operator: 'pm-with',
            operand: user.email,
          }
        ]
      };
      console.log('user stream detail', streamDetail);
      this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
          const allMessages = response.zulip.messages;
          if (allMessages.length >= 1){
            this.messagesWithIndividuals.push(... allMessages.slice(0, 10));
            // tslint:disable-next-line:max-line-length
            this.messagingService.changePmNames(this.messagesWithIndividuals.map(individualMessage => individualMessage.display_recipient));
            this.change.detectChanges();

          }
        } ,
        (error: any) => {
          console.log('error', error);
        });
    });
  }

}
