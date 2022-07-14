import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MessagingService} from '../../services/messaging.service';
import {Router} from '@angular/router';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
// @Todo change this to fetch only private messages
import {getAllMessages, getLoadingPrivateMsgs, getMessageType, getPrivateMessages} from '../../state/messaging.selectors';
import * as messageActions from '../../state/messaging.actions';
import {Observable} from 'rxjs';
import {StreamDetail} from '../../models/messages.model';
import {getAllUsers, getUserDetails} from '../../../../auth/state/auth.selectors';
import {LoadMoreMessaging, LoadPrivateMessages} from '../../state/messaging.actions';

@Component({
  selector: 'app-all-private-messages-board',
  templateUrl: './all-private-messages-board.component.html',
  styleUrls: ['./all-private-messages-board.component.scss']
})
export class AllPrivateMessagesBoardComponent implements OnInit {
  allUsers = Array();
  stateUsers = Array();
  messagesWithIndividuals = Array();
  @Output() pmMemberNames = new EventEmitter<any>();
  @Output() emitReplyMsg = new EventEmitter<any>();
  initialMessageCount = 10;
  messages$!: Observable<any>;
  loadingMessages!: Observable<boolean>;
  operator = '';
  operand: any;
  streamDetail!: Observable<StreamDetail>;
  messageExist: any;

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
    this.getAllPrivateChats();
  }

  // getOperator(): StreamDetail {
  //   this.store.select();
  // }

  // Init page
  initPage(): void {

    // get Loading Message
    this.loadingMessages = this.store.select(getLoadingPrivateMsgs);

    // get messages from store
    this.messages$ = this.store.select(getPrivateMessages);

    document?.getElementById('box')?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });

    this.messagesLength();
  }

  messagesLength(): void {
    this.store.select(getPrivateMessages).subscribe(
      messages => {
        // @ts-ignore
        this.messageExist = messages?.length > 0;
      }
    );
  }

  allUsersRegistered(): void {
    this.messagingService.getUsersByAvailability().subscribe((users: { members: any[]; }) => {
      console.log('All users: ', users);
      const usersPresent = users.members.filter(user => user.presence );
      // this.allUsers = this.messagingService.newListOfUsers(usersPresent);
    });
    setTimeout( () => {
    this.getAllPrivateChats();
    }, 1000);


    this.store.select(getAllUsers).subscribe(
      users => {
        this.stateUsers = users?.filter((user: any) => user.presence );
      }
    );
    // Todo add loading indicator for this time

    if (this.stateUsers){
      this.getAllPrivateChatsTwo();
    }

    setTimeout( () => {
      this.getAllPrivateChatsTwo();
    }, 2000);
  }

  getAllPrivateChatsTwo(): any{
    this.stateUsers.map( user => {
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
      // this.store.dispatch(new LoadPrivateMessages(streamDetail));
      this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
          const allMessages = response.zulip.messages;
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
        console.log('Private message content: ', response);
        const allMessages = response.zulip.messages;
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
      // console.log('user stream detail', streamDetail);
      this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
          const allMessages = response.zulip.messages;
          if (allMessages.length >= 1){
            this.store.dispatch(new messageActions.LoadMoreMessaging(allMessages.slice(0, 10)));
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

  replyMessage(chat: any): void {
    console.log('Message to be replied: ', chat);
    this.emitReplyMsg.emit(chat);
  }

}
