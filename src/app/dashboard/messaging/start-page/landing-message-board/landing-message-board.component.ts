import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MessagingService } from '../../services/messaging.service';

// NgRx
import { Store } from '@ngrx/store';
import * as messageActions from '../../state/messaging.actions';
import { AppState } from '../../../../state/app.state';
import { BehaviorSubject, Observable } from 'rxjs';
import { SingleChat, SingleMessageModel } from '../../models/messages.model';
import {OonaSocketService} from '../../services/oona-socket.service';
import * as privateMsgActions from '../../../state/actions/private.messages.actions';
import * as streamMsgActions from '../../../state/actions/streams.messages.actions';
import {getStreamMessages, streamMessagesLoaded, streamMessagesLoading} from '../../../state/entities/messages/stream.messages.entity';
// import {allMessages} from '../../../state/dash.selectors';

@Component({
  selector: 'app-landing-message-board',
  templateUrl: './landing-message-board.component.html',
  styleUrls: ['./landing-message-board.component.scss'],
})
export class LandingMessageBoardComponent implements OnInit {
  @ViewChild('endChat') endChat: ElementRef | undefined;

  allTeams = Array();
  messagesOfStream = Array();
  initialMessageCount = 30;
  loadingMessages!: Observable<boolean>;
  messageExist: any;
  editorActive = true;
  editorChat: any;

  allMessages: SingleMessageModel[] = [];
  dateSortedPrivateMessages: SingleMessageModel[] = [];

  allMsgId: number[] = [];
  allStreamId: number[] = [];
  socketsMsgIds: number[] = [];

  loading = true;
  currentUserId$!: Observable<number>;

  privateMessages = Array();
  privateMessagesSubject = new BehaviorSubject(this.privateMessages);

  messages$: Observable<any> = this.store.select(getStreamMessages);
  loading$: Observable<boolean> = this.store.select(streamMessagesLoading);
  loaded$: Observable<boolean> = this.store.select(streamMessagesLoaded);

  constructor(
    private messagingService: MessagingService,
    private change: ChangeDetectorRef,
    private userSocketService: OonaSocketService,
    private store: Store<AppState>
  ) {

  }

  ngOnInit(): void {
    // this.initPage();
    // this.currentUserId$ = this.store.select(getUserId);
    this.getMessages();
  }

  getMessages(): void {
    const firstUnread = {
      anchor: 'first_unread',
      num_before: 200,
      num_after: 200,
      narrow: [{
        negated: false,
        operator: 'in',
        operand: 'home'
      }],
      client_gravatar: true
    };

    const newestPayload = {
      anchor: 'newest',
      num_before: 400,
      num_after: 0,
      narrow: [{
        negated: false,
        operator: 'in',
        operand: 'home'
      }],
      client_gravatar: true
    };

    // Load both private and stream messages
    this.store.dispatch(new privateMsgActions.LoadPrivateMsg(newestPayload));
    this.store.dispatch(new streamMsgActions.LoadStreamMsg(firstUnread));
  }

  // Init Page
  initPage(): void {
    // get messages from store
    // this.store.select(getBothMessages).subscribe(
    //   (messages: SingleMessageModel[]) => {
    //     if (messages) {
    //       this.loading = false;
    //       this.scrollBottom();
    //     }
    //   }
    // );
    // this.messages$ = this.store.select(getBothMessages);

    // get Loading Message
    // this.loadingMessages = this.store.select(getLoadingAllMsg);

    // this.messagesLength();
    this.scrollBottom();
  }

  // messagesLength(): void {
  //   this.store.select(getAllMessages).subscribe((messages) => {
  //     // @ts-ignore
  //     this.messageExist = messages?.length > 0;
  //   });
  // }

  allMemberTeams(): void {
    this.messagingService.getAllTeams().subscribe((teams: any) => {
      this.allTeams = teams.streams.map((team: { name: any }) => team.name);
    });
  }

  getMorePrivateMessages(): void {
    this.initialMessageCount = this.initialMessageCount + 10;
    // get messages of each team
    this.allTeams?.map((teamName: any) => {
      const streamDetail = {
        use_first_unread_anchor: true,
        num_before: this.initialMessageCount,
        type: [
          {
            operator: 'stream',
            operand: teamName,
          },
        ],
      };
      this.messagingService.getMessagesOfStream(streamDetail).subscribe(
        (response: any) => {
          this.change.detectChanges();
          // add the 10 items to the top of the stack
          this.messagesOfStream.unshift(
            ...response.zulip.messages.slice(0, 10)
          );
          // sort by time. latest last
          // this.messagesOfStream.sort((a, b) =>  a.timestamp - b.timestamp );
          this.change.detectChanges();
        },
        (error: any) => {
          console.log('error', error);
        }
      );
    });
  }

  // getStreamMessage(): void {
  //   // get stream messages from store
  //   this.store.select(getStreamMessages).subscribe((streamData) => {
  //     streamData?.map((msg: SingleMessageModel) => {
  //       if (this.allStreamId.includes(msg.id)) {
  //         return;
  //       }
  //
  //       this.allMessages.push(msg);
  //       this.allStreamId.push(msg.id);
  //     });
  //   });
  //
  //   // get private messages from store
  //   this.store.select(getPrivateMessages).subscribe((allMessages) => {
  //     allMessages?.map((msg: SingleMessageModel) => {
  //       if (this.allMsgId.includes(msg.id)) {
  //         return;
  //       }
  //
  //       this.allMessages.push(msg);
  //       this.allMsgId.push(msg.id);
  //     });
  //   });
  //   this.sortMessages();
  // }

  inComingMessage(): void {
    this.userSocketService.privateMessageCountSocket.subscribe((prvMsg) => {
      prvMsg.map((msg) => {
        if (this.socketsMsgIds.includes(msg.id)) {
          return;
        }

        this.socketsMsgIds.push(msg.id);
        console.log('Incoming message from another person ===>>>', msg);
        this.dateSortedPrivateMessages.push(msg);
        // this.change.detectChanges();
        // this.scrollBottom();
      });
    });
  }

  outGoingMsg(): void {
    this.userSocketService.myMessagesSocketSubject.subscribe((msg: any) => {
      console.log('My sent outgoing message content ===>>>', msg);

      this.privateMessagesSubject.subscribe((messages) => {
        console.log('Private messages content ===>>>', messages);

        if (this.socketsMsgIds.includes(msg.id)) {
          return;
        }

        if (!msg.id) {
          return;
        }

        this.socketsMsgIds.push(msg.id);
        this.dateSortedPrivateMessages.push(msg);
      });
    });
  }

  sortMessages(): void {
    // this.loadingMessages = false;
    this.dateSortedPrivateMessages = this.allMessages.sort(
      (a, b) => a.timestamp - b.timestamp
    );
    this.scrollBottom();
  }
  selectedChat(chat: SingleChat): any {
    this.editorActive = true;
    this.store.dispatch(new messageActions.HandleSendMessage(chat));
    this.editorChat = chat;
  }

  scrollBottom(): any {
    if (this.endChat) {
        // @ts-ignore
        this.endChat.nativeElement.scrollIntoView({
          behavior: 'smooth',
          // block: 'start',
          // inline: 'nearest',
        });
    }
  }
}
