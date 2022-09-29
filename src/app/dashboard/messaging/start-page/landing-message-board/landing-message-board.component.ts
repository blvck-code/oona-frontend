import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MessagingService } from '../../services/messaging.service';

// NgRx
import { Store } from '@ngrx/store';
import * as messageActions from '../../state/messaging.actions';
import { AppState } from '../../../../state/app.state';
import {
  getLoadingAllMsg,
  getAllMessages,
  getAllStreamData, getPrivateMessages, getStreamMessages, getBothMessages,
} from '../../state/messaging.selectors';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { SingleChat, SingleMessageModel } from '../../models/messages.model';
import { map, switchMap } from 'rxjs/operators';
import {OonaSocketService} from '../../services/oona-socket.service';

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
  messages$!: Observable<any>;
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

  privateMessages = Array();
  privateMessagesSubject = new BehaviorSubject(this.privateMessages);
  privateMessageObservable = this.privateMessagesSubject.asObservable();

  allMessages$!: Observable<any>;

  constructor(
    private messagingService: MessagingService,
    private change: ChangeDetectorRef,
    private userSocketService: OonaSocketService,
    private store: Store<AppState>
  ) {
    this.allMemberTeams();
  }

  ngOnInit(): void {
    this.initPage();
  }

  getLastItem(): void {
    setTimeout(() => {
      this.messages$.subscribe(
        (messages: SingleMessageModel[]) => {

          const lastItem: SingleMessageModel = messages[messages.length - 1];

        }
      );
    }, 1500);
  }

  // Init Page
  initPage(): void {
    // get messages from store
    this.messages$ = this.store.select(getBothMessages);
    this.getLastItem();
    this.getStreamMessage();
    // updating UI with the latest messages
    this.inComingMessage();
    this.outGoingMsg();

    // get Loading Message
    this.loadingMessages = this.store.select(getLoadingAllMsg);

    this.store.select(getBothMessages).subscribe(
      (messages: SingleMessageModel[]) => {
        messages ? this.loading = false :  ''
      }
    )


    this.messagesLength();
    // @ts-ignore
    document
      ?.getElementById('box')
      ?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  }

  messagesLength(): void {
    this.store.select(getAllMessages).subscribe((messages) => {
      // @ts-ignore
      this.messageExist = messages?.length > 0;
    });
  }

  allMemberTeams(): void {
    this.messagingService.getAllTeams().subscribe((teams: any) => {
      this.allTeams = teams.streams.map((team: { name: any }) => team.name);
    });
  }

  getMessagesOfTeams(): void {
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
          this.messagesOfStream.push(...response?.zulip?.messages);
          // sort by time. latest last
          this.messagesOfStream.sort((a, b) => a.timestamp - b.timestamp);
          this.change.detectChanges();

          // @ts-ignore
          document.getElementById('box').scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',
          });
        },
        (error: any) => {
          console.log('error', error);
        }
      );
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
          // get first 10 items from this new array array.slice(0, 10);
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

  getStreamMessage(): void {
    // get stream messages from store
    this.store.select(getStreamMessages).subscribe((streamData) => {
      streamData?.map((msg: SingleMessageModel) => {
        if (this.allStreamId.includes(msg.id)) {
          return;
        }

        this.allMessages.push(msg);
        this.allStreamId.push(msg.id);
      });
    });

    // get private messages from store
    this.store.select(getPrivateMessages).subscribe((allMessages) => {
      allMessages?.map((msg: SingleMessageModel) => {
        if (this.allMsgId.includes(msg.id)) {
          return;
        }

        this.allMessages.push(msg);
        this.allMsgId.push(msg.id);
      });
    });
    this.sortMessages();
  }

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
}
