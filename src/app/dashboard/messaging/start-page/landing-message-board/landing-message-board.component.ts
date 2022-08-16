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
  getAllStreamData,
} from '../../state/messaging.selectors';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { SingleChat, SingleMessageModel } from '../../models/messages.model';
import { map, switchMap } from 'rxjs/operators';

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

  allMessages$!: Observable<any>;

  constructor(
    private messagingService: MessagingService,
    private change: ChangeDetectorRef,
    private store: Store<AppState>
  ) {
    this.allMemberTeams();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getMessagesOfTeams();
    }, 1000);
    this.initPage();

    this.tested();
  }

  // Init Page
  initPage(): void {
    this.getStreamMessage();
    // this.getPrivateMessages();

    // get Loading Message
    this.loadingMessages = this.store.select(getLoadingAllMsg);

    // get messages from store
    this.messages$ = this.store.select(getAllMessages);

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
          this.messagesOfStream.push(...response.zulip.messages);
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
    this.store.select(getAllStreamData).subscribe((streamData) => {
      streamData?.map((msg: SingleMessageModel) => {
        if (this.allStreamId.includes(msg.id)) {
          return;
        }

        this.allMessages.push(msg);
        this.allStreamId.push(msg.id);
      });
    });

    // get private messages from store
    this.store.select(getAllMessages).subscribe((allMessages) => {
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

  tested(): void {
    console.log('123 123 432')
    const allStreamMessages$: Observable<SingleMessageModel[]> =
      this.store.select(getAllStreamData);
    const allPrivateMessages$: Observable<SingleMessageModel[]> =
      this.store.select(getAllMessages);

    const allMessages: any = combineLatest(
      allStreamMessages$,
      allPrivateMessages$
    ).pipe(
      map(([streamMessage, privateMessage]) => {
        return [...streamMessage, ...privateMessage];
      })
    );

    console.log('all messages ===>>>', allMessages);
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
