import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MessagingService} from '../../services/messaging.service';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';

// NgRx
import {AppState} from '../../../../state/app.state';
import * as messagingActions from '../../state/messaging.actions';
// @Todo change this to get only individual messages
import {getLoadingAllMsg, getAllMessages} from '../../state/messaging.selectors';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-group-pms-messaging-board',
  templateUrl: './group-pms-messaging-board.component.html',
  styleUrls: ['./group-pms-messaging-board.component.scss']
})
export class GroupPmsMessagingBoardComponent implements OnInit {
  allUsers = Array();
  messagesWithIndividuals = Array();
  loggedUserProfile: any;
  messages$!: Observable<any>;
  loadingMessages$!: Observable<boolean>;
  messageExist: any;
  initialMessageCount =  20;
  operands = '';

  constructor(
    private messagingService: MessagingService,
    private router: Router,
    private change: ChangeDetectorRef,
    private store: Store<AppState>
  ) {this.userProfileDetail(); }

  ngOnInit(): void {
    this.initPage();
  }

  // initialize page
  initPage(): void {
    const streamDetail = {
      use_first_unread_anchor: true,
      apply_markdown: false,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'group-pm-with',
          operand: 'maurice.oluoch@8teq.co.ke',
        }
      ]
    };

    // fetch data from server
    this.store.dispatch(new messagingActions.LoadMessaging(streamDetail));

    // get Loading Message
    this.loadingMessages$ = this.store.select(getLoadingAllMsg);

    // get messages from store
    this.messages$ = this.store.select(getAllMessages);

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
          console.log('Group messages ===>>>', response);

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
