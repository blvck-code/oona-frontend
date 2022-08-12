import {ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MessagingService} from '../../services/messaging.service';
import {Router} from '@angular/router';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
// @Todo change this to fetch only private messages
import {getAllMessages, getLoadingPrivateMsgs, getMessageType } from '../../state/messaging.selectors';
import * as messageActions from '../../state/messaging.actions';
import {BehaviorSubject, Observable} from 'rxjs';
import {SingleChat, SingleMessageModel, StreamDetail} from '../../models/messages.model';
import {getAllUsers, getUserDetails, getZulipUsers} from '../../../../auth/state/auth.selectors';
import {LoadMoreMessaging, LoadPrivateMessages} from '../../state/messaging.actions';
import {take} from 'rxjs/operators';
import {OonaSocketService} from '../../services/oona-socket.service';

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
  loadingMessages = false;
  operator = '';
  activeMessage: SingleChat | undefined;
  streamDetail!: Observable<StreamDetail>;
  messageExist: any;

  privateMessages = Array();
  dateSortedPrivateMessages = Array();
  privateMessagesSubject = new BehaviorSubject(this.privateMessages);
  privateMessageObservable = this.privateMessagesSubject.asObservable();

  messagesId: number[] = [];

  @ViewChild('endChat') endChat: ElementRef | undefined;

  constructor(
    private messagingService: MessagingService,
    private router: Router,
    private userSocketService: OonaSocketService,
    private change: ChangeDetectorRef,
    private store: Store<AppState>
  ) {
    this.allUsersRegistered();
  }

  ngOnInit(): void {
    this.initPage();
    this.getAllPrivateMessages();
    this.inComingMessage();
    this.outGoingMsg();
  }

  // Init page
  initPage(): void {
  }

  // Todo add private messages
  // messagesLength(): void {
  //   this.store.select(getPrivateMessages).subscribe(
  //     messages => {
  //       // @ts-ignore
  //       this.messageExist = messages?.length > 0;
  //     }
  //   );
  // }

  allUsersRegistered(): void {
    // this.messagingService.getUsersByAvailability().subscribe((users: { members: any[]; }) => {
    //   console.log('All users: ', users);
    //   const usersPresent = users.members.filter(user => user.presence );
    //   this.allUsers = this.messagingService.newListOfUsers(usersPresent);
    // });
    // setTimeout( () => {
    // this.getAllPrivateChats();
    // }, 1000);

    this.loadingMessages = true;

    this.store.select(getAllUsers).subscribe(
  users => {
        if (users) {
          this.stateUsers = users?.filter((user: any) => user.presence );
          // Todo add loading indicator for this time
          this.getAllPrivateChatsTwo();
        }
      }
    );
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
          this.loadingMessages = false;
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
            this.scrollBottom();
            // document.getElementById('box').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          }
        } ,
        (error: any) => {
          console.log('error', error);
        });
    });
  }

  getAllPrivateMessages(): void{
    this.store.select(getAllUsers).subscribe(users => {
      console.log('All users fetched ===>>>>', users);

      users?.map((user: any) => {

        const streamDetail = {
          anchor: 'newest',
          num_before: 100,
          num_after: 0,
          type: [
            {
              operator: 'pm-with',
              operand: user?.email
            }
          ]
        };

        this.messagingService.getMessagesOfStream(streamDetail).subscribe(
          (response: any) => {
            const messages = response?.zulip?.messages;

            messages?.forEach((msg: SingleMessageModel) => {
              if (msg) {
                this.privateMessages.push(msg);
                this.sortMessages();
              }
            });

          }
        );
      });
    });
  }

  sortMessages(): void{
    this.dateSortedPrivateMessages = this.privateMessages.sort((a, b ) => a.timestamp - b.timestamp);
    this.scrollBottom();
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
      // this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
      //   console.log('Private message content: ', response);
      //   const allMessages = response.zulip.messages;
      //   if (allMessages.length >= 1){
      //     this.messagesWithIndividuals.push(... allMessages);
      //     // tslint:disable-next-line:max-line-length
      //     this.messagingService.changePmNames(
      //       this.messagesWithIndividuals.map(individualMessage => individualMessage.display_recipient)
      //     );
      //     // sort by timestamp
      //     this.messagesWithIndividuals.sort((a, b) =>  a.timestamp - b.timestamp );
      //     this.change.detectChanges();
      //     // @ts-ignore
      //     document.getElementById('box').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      //     }
      //   } ,
    //     (error: any) => {
    //       console.log('error', error);
    //     });
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

  inComingMessage(): void {
    this.userSocketService.privateMessageCountSocket.subscribe(
      prvMsg => {
        prvMsg.map(msg => {

          if (this.messagesId.includes(msg.id)){
            return;
          }

          this.messagesId.push(msg.id);
          this.dateSortedPrivateMessages.push(msg);
          // this.change.detectChanges();
          // this.scrollBottom();
        });
      }
    );
  }

  outGoingMsg(): void{
    this.userSocketService.myMessagesSocketSubject.subscribe(
      (msg: any) => {

        this.privateMessagesSubject.subscribe( messages => {

          if (this.messagesId.includes(msg.id)){
            return;
          }

          if (!msg.id){
            return;
          }

          this.messagesId.push(msg.id);
          this.dateSortedPrivateMessages.push(msg);
          }
        );

      }
    );
  }

  replyMessage(chat: any): void {
    this.activeMessage = chat;
    this.store.dispatch(new messageActions.HandleSendMessage(chat));
  }

  scrollBottom(): any {
    if (this.endChat) {
      setTimeout(() => {
        // @ts-ignore
        this.endChat.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest'});
      }, 500);
    }
  }

}
