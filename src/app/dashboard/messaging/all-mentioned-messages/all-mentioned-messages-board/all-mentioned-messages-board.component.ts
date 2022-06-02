import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MessagingService} from '../../services/messaging.service';
import {Router} from '@angular/router';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import * as messagingActions from '../../state/messaging.actions';
import {Observable} from 'rxjs';
import {getLoadingMsg, getMessages} from '../../state/messaging.selectors';
import {getUserDetails} from '../../../../auth/state/auth.selectors';

@Component({
  selector: 'app-all-mentioned-messages-board',
  templateUrl: './all-mentioned-messages-board.component.html',
  styleUrls: ['./all-mentioned-messages-board.component.scss']
})
export class AllMentionedMessagesBoardComponent implements OnInit {

  mentionsWithIndividuals = new Array();
  loggedInUserProfile: any;
  initialMessageCount =  10;
  messages$!: Observable<any>;
  loadingMessages$!: Observable<boolean>;
  userName = '';
  messageExist: any;

  constructor(
    private messagingService: MessagingService,
    private router: Router,
    private change: ChangeDetectorRef,
    private store: Store<AppState>
  ) {
    this.userProfile();
  }

  ngOnInit(): void {
    // setTimeout(() => {
    // this.getAllMentions();
    // }, 1000);
    this.userProfile();
    this.initPage();
  }

  initPage(): void {
    const streamDetail = {
      use_first_unread_anchor: true,
      apply_markdown: false,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'search',
          // @Todo change this to current logged in user
          operand: this.userName,
        }
      ]
    };

    this.store.dispatch(new messagingActions.LoadMessaging(streamDetail));

    // get loading messages
    this.loadingMessages$ = this.store.select(getLoadingMsg);

    // get messages from store
    this.messages$ = this.store.select(getMessages);

    // check messages length
    this.messagesLength();
  }

  messagesLength(): void {
    this.store.select(getMessages).subscribe(
      messages => {
        // @ts-ignore
        if (messages?.length > 0) {
          console.log('Messages length ==>>', messages?.length);
          this.messageExist = true;
        } else {
          this.messageExist = false;
        }
      }
    );
  }

  userProfile(): any{
    this.messagingService.currentUserProfile().subscribe((profile: any) => {
      this.loggedInUserProfile = profile.zulip;
      this.getAllMentions(profile.zulip.full_name);
    });

    this.store.select(getUserDetails).subscribe(
      data => {
        this.userName = `${data?.first_name} ${data?.last_name}`;
      }
    );
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

  // get more private messages
  getMore(): void {
    this.initialMessageCount = this.initialMessageCount + 10;

    const streamDetail = {
      use_first_unread_anchor: true,
      apply_markdown: false,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'search',
          operand: this.userName,
        }
      ]
    };

    this.store.dispatch(new messagingActions.LoadMoreMessaging(streamDetail));

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
