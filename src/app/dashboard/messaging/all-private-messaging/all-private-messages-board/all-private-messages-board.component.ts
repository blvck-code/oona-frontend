import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MessagingService } from '../../services/messaging.service';
import { Router } from '@angular/router';

// NgRx
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app.state';
// @Todo change this to fetch only private messages
import * as messageActions from '../../state/messaging.actions';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import {
  SingleChat,
  SingleMessageModel,
  StreamDetail,
} from '../../models/messages.model';
import { getAllUsers, getUserId } from '../../../../auth/state/auth.selectors';
import { OonaSocketService } from '../../services/oona-socket.service';
import {
  privateMessagesLoaded,
  privateMessagesLoading,
  getPrivateMessages,
  allPrivateMessages,
} from '../../../state/entities/messages/private.messages.entity';
import { getStreamMessages } from '../../../state/entities/messages/stream.messages.entity';

@Component({
  selector: 'app-all-private-messages-board',
  templateUrl: './all-private-messages-board.component.html',
  styleUrls: ['./all-private-messages-board.component.scss'],
})
export class AllPrivateMessagesBoardComponent implements OnInit, OnDestroy {
  allUsers = Array();
  stateUsers = Array();
  messagesWithIndividuals = Array();
  @Output() pmMemberNames = new EventEmitter<any>();
  @Output() emitReplyMsg = new EventEmitter<any>();
  initialMessageCount = 10;
  loadingMessages = true;
  operator = '';
  activeMessage: SingleChat | undefined;
  streamDetail!: Observable<StreamDetail>;

  loading = true;
  subscription!: Subscription;

  privateMessages = Array();
  dateSortedPrivateMessages = Array();
  privateMessagesSubject = new BehaviorSubject(this.privateMessages);
  privateMessageObservable = this.privateMessagesSubject.asObservable();

  messagesId: number[] = [];
  storeMessagesId: number[] = [];

  currentUserId$!: Observable<any>;
  @ViewChild('endChat') endChat: ElementRef | undefined;

  // @ts-ignore
  messages$: Observable<SingleMessageModel[]> =
    this.store.select(allPrivateMessages);
  loading$: Observable<boolean> = this.store.select(privateMessagesLoading);
  loaded$: Observable<boolean> = this.store.select(privateMessagesLoaded);

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
    this.currentUserId$ = this.store.select(getUserId);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Init page
  initPage(): void {}

  allUsersRegistered(): void {
    this.store.select(getAllUsers).subscribe((users) => {
      if (users) {
        this.stateUsers = users?.filter((user: any) => user.presence);
        // Todo add loading indicator for this time
        // this.getAllPrivateChatsTwo();
      }
    });
  }

  getAllPrivateChatsTwo(): any {
    this.stateUsers.map((user) => {
      const streamDetail = {
        use_first_unread_anchor: true,
        apply_markdown: false,
        num_before: this.initialMessageCount,
        type: [
          {
            operator: 'pm-with',
            operand: user.email,
          },
        ],
      };
      // this.store.dispatch(new LoadPrivateMessages(streamDetail));
      this.messagingService.getMessagesOfStream(streamDetail).subscribe(
        (response: any) => {
          const allMessages = response.zulip.messages;
          if (allMessages.length >= 1) {
            this.messagesWithIndividuals.push(...allMessages);
            // tslint:disable-next-line:max-line-length
            this.messagingService.changePmNames(
              this.messagesWithIndividuals.map(
                (individualMessage) => individualMessage.display_recipient
              )
            );
            // sort by timestamp
            this.messagesWithIndividuals.sort(
              (a, b) => a.timestamp - b.timestamp
            );
            this.change.detectChanges();
            // @ts-ignore
            this.scrollBottom();
            // document.getElementById('box').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          }
        },
        (error: any) => {
          console.log('error', error);
        }
      );
    });
  }

  // getStateAllPrivateMessages(): void {
  //   this.subscription = this.store
  //     .select(getPrivateMessages)
  //     .subscribe((messages: SingleMessageModel[]) => {
  //       messages?.forEach((msg: SingleMessageModel) => {
  //         if (msg) {
  //           if (this.storeMessagesId.includes(msg.id)) {
  //             return;
  //           } else {
  //             this.privateMessages.push(msg);
  //             this.sortMessages();
  //           }
  //           this.storeMessagesId.push(msg.id);
  //         }
  //       });
  //     });
  // }

  sortMessages(): void {
    this.loadingMessages = false;
    this.dateSortedPrivateMessages = this.privateMessages.sort(
      (a, b) => a.timestamp - b.timestamp
    );
    this.scrollBottom();
  }

  getMorePrivateMessages(): void {
    this.initialMessageCount = this.initialMessageCount + 10;
    this.allUsers.forEach((user) => {
      const streamDetail = {
        use_first_unread_anchor: true,
        apply_markdown: false,
        num_before: this.initialMessageCount,
        type: [
          {
            operator: 'pm-with',
            operand: user.email,
          },
        ],
      };
      this.messagingService.getMessagesOfStream(streamDetail).subscribe(
        (response: any) => {
          const allMessages = response.zulip.messages;
          console.log('All messages content ===>>>', allMessages);
          if (allMessages.length >= 1) {
            this.store.dispatch(
              new messageActions.LoadMoreMessaging(allMessages.slice(0, 10))
            );
            this.messagesWithIndividuals.push(...allMessages.slice(0, 10));
            // tslint:disable-next-line:max-line-length
            this.messagingService.changePmNames(
              this.messagesWithIndividuals.map(
                (individualMessage) => individualMessage.display_recipient
              )
            );
            this.change.detectChanges();
          }
        },
        (error: any) => {
          console.log('error', error);
        }
      );
    });
  }

  replyMessage(chat: any): void {
    this.activeMessage = chat;
    this.store.dispatch(new messageActions.HandleSendMessage(chat));
  }

  scrollBottom(): any {
    if (this.endChat) {
      setTimeout(() => {
        // @ts-ignore
        this.endChat.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }, 500);
    }
  }

  // inComingMessage(): void {
  //   this.userSocketService.privateMessageCountSocket.subscribe((prvMsg) => {
  //     prvMsg.map((msg) => {
  //       if (this.messagesId.includes(msg.id)) {
  //         return;
  //       }
  //
  //       this.messagesId.push(msg.id);
  //       this.dateSortedPrivateMessages.push(msg);
  //       // this.change.detectChanges();
  //       // this.scrollBottom();
  //     });
  //   });
  // }

  // outGoingMsg(): void {
  //   this.userSocketService.myMessagesSocketSubject.subscribe((msg: any) => {
  //     console.log('My sent outgoing message content ===>>>', msg);
  //
  //     this.privateMessagesSubject.subscribe((messages) => {
  //
  //       if (this.messagesId.includes(msg.id)) {
  //         return;
  //       }
  //
  //       if (!msg.id) {
  //         return;
  //       }
  //
  //       this.messagesId.push(msg.id);
  //       this.dateSortedPrivateMessages.push(msg);
  //     });
  //   });
  // }

  // getAllPrivateMessages(): void {
  //   this.store.select(getAllUsers).subscribe((users) => {
  //     users?.map((user: any) => {
  //       const streamDetail = {
  //         anchor: 'newest',
  //         num_before: 100,
  //         num_after: 0,
  //         type: [
  //           {
  //             operator: 'pm-with',
  //             operand: user?.email,
  //           },
  //         ],
  //       };
  //
  //       this.messagingService
  //         .getMessagesOfStream(streamDetail)
  //         .subscribe((response: any) => {
  //           const messages = response?.zulip?.messages;
  //
  //           messages?.forEach((msg: SingleMessageModel) => {
  //             if (msg) {
  //               this.privateMessages.push(msg);
  //               this.sortMessages();
  //             }
  //           });
  //         });
  //     });
  //   });
  // }
}
