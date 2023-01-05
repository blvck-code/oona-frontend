import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagingService } from '../../services/messaging.service';

import TurndownService from 'turndown';
import { OonaSocketService } from '../../services/oona-socket.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app.state';
import { Observable } from 'rxjs';
import {
  getSelectedStream,
  getSelectedTopic,
  getStreams,
} from '../../../state/entities/streams.entity';
import {
  filteredStreamMsg,
  streamMessagesLoaded,
  streamMessagesLoading,
} from '../../../state/entities/messages/stream.messages.entity';

const turndownService = new TurndownService();

@Component({
  selector: 'app-chat-board',
  templateUrl: './chat-board.component.html',
  styleUrls: ['./chat-board.component.scss'],
})
export class ChatBoardComponent implements OnInit {
  streamName = '';
  messagesOfStream = Array();
  filteredMessagesOfStream = Array();
  messageDate: Date = new Date();
  messageTopic: any;
  filteredStreamTopic = '';
  latItemTopic: any;
  initialMessageCount = 30;
  topicSelected = '';
  loading = true;
  currentUserId$!: Observable<number>;

  selectedStreamMessages$: Observable<any> = this.store.select(getStreams);

  messages$: Observable<any> = this.store.select(filteredStreamMsg);
  loading$: Observable<boolean> = this.store.select(streamMessagesLoading);
  loaded$: Observable<boolean> = this.store.select(streamMessagesLoaded);
  selectedStream$: Observable<any> = this.store.select(getSelectedStream);
  selectedTopic$: Observable<string> = this.store.select(getSelectedTopic);

  constructor(
    private route: ActivatedRoute,
    private messagingService: MessagingService,
    private change: ChangeDetectorRef,
    private router: Router,
    private userSocketService: OonaSocketService,
    private store: Store<AppState>
  ) {}

  getStreamMessages(): void {
    const topicRequest = {
      anchor: 1750,
      num_before: 50,
      num_after: 50,
      narrow: [
        {
          negated: false,
          operator: 1,
          operand: 'private', // stream id
        },
        {
          negated: false,
          operator: 'topic',
          operand: 'new streams', // topic name
        },
      ],
      client_gravatar: true,
    };
    // this.store.dispatch(new msgActions.LoadMessage(topicRequest));

    // this.selectedStream$.subscribe({
    //   next: (streamId: any) => {
    //
    //     if (this.selectedTopic$) {
    //       this.selectedTopic$.subscribe({
    //         next: (topic: string) => {
    //           console.log('Getting topic content ==>>', topic);
    //           const topicRequest = {
    //             anchor: 1750,
    //             num_before: 50,
    //             num_after: 50,
    //             narrow: [
    //               {
    //                 negated: false,
    //                 operator: 1,
    //                 operand: 'private' // stream id
    //               },
    //               {
    //                 negated: false,
    //                 operator: 'topic',
    //                 operand: topic // topic name
    //               }
    //             ],
    //             client_gravatar: true
    //           };
    //           this.store.dispatch(new msgActions.LoadMessage(topicRequest));
    //         }
    //       });
    //     } else {
    //       console.log('Getting stream content ==>>', streamId);
    //       const streamRequest = {
    //         anchor: 1860,
    //         num_before: 50,
    //         num_after: 50,
    //         narrow: [{
    //           negated: false,
    //           operator: 'stream',
    //           operand: streamId // stream id
    //         }],
    //         client_gravatar: true
    //       };
    //       this.store.dispatch(new msgActions.LoadMessage(streamRequest));
    //     }
    //   }
    // });
  }

  // storeStreamMessages(): void {
  //   this.selectedStreamMessages$ = this.store.select(getSelectedStreamMessages);
  //   this.store.select(getSelectedStreamMessages).subscribe(() => {
  //     this.loading = false;
  //   });
  // }

  ngOnInit(): void {
    this.selectedTopic$.subscribe({
      next: (resp) => {
        this.messageTopic = resp;
      },
    });
    this.getStreamMessages();
    this.getStreamName();
    this.messages$.subscribe({
      next: (messages) => {
        console.log(messages);
      },
    });
  }

  getStreamName(): void {
    this.store.select(getSelectedStream).subscribe({
      next: (streamId: number | null) => {
        if (streamId) {
          this.store.select(getStreams).subscribe({
            next: (streams) => {
              streams.map((stream) => {
                if (+stream.stream_id === streamId) {
                  this.streamName = stream.name;
                }
              });
            },
          });
        }
      },
    });
  }

  streamMessages(streamParamDetail: any): void {
    this.messagingService.getAllTeams().subscribe((teams: any) => {
      const streamName = teams.streams.find(
        (team: { stream_id: any }) =>
          team?.stream_id === Number(streamParamDetail.id)
      ).name;
      this.streamName = streamName;

      const streamDetail = {
        use_first_unread_anchor: true,
        apply_markdown: false,
        num_before: 30,
        type: [
          {
            operator: 'stream',
            operand: streamName,
          },
        ],
      };
      this.messagingService.getMessagesOfStream(streamDetail).subscribe(
        (response: any) => {
          const allMessages = response.zulip.messages;
          // this.messagesOfStream = allMessages;

          if (this.filteredStreamTopic !== '') {
            this.messagesOfStream = allMessages.filter(
              (message: { subject: string }) =>
                message.subject === this.filteredStreamTopic
            );
          } else {
            this.messagesOfStream = allMessages;
            this.filteredMessagesOfStream = allMessages;
          }
          this.change.detectChanges();
          // @ts-ignore
          document.getElementById('box').scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',
          });
          const lastItem =
            this.messagesOfStream[this.messagesOfStream.length - 1];
          this.latItemTopic = lastItem.subject;
          this.messagingService.changeEditorTopic(lastItem.subject);

          this.sortMessageDates();
        },
        (error: any) => {
          console.log('error', error);
        }
      );
    });
  }

  sortMessageDates(): void {
    const messageTimeStamps = this.messagesOfStream.map(
      (message) => message.timestamp
    );
    messageTimeStamps.forEach((messageTime) => {
      if (this.messageDate === new Date()) {
        this.messageDate = new Date(messageTime * 1000);
      } else if (messageTime > this.messageDate) {
        this.messageDate = new Date(messageTime * 1000);
      }
    });
  }

  sendMessageToStream(message: any): void {
    const markdown = turndownService.turndown(message);

    if (!this.messageTopic) {
      // use the last subject from the chat by default
      this.messageTopic = 'new streams';
    }
    const messageDetail = {
      to: this.streamName,
      topic: this.messageTopic,
      content: markdown,
    };
    this.messagingService.sendStreamMessage(messageDetail).subscribe(
      () => {
        // re-fetch messages with pm
        const streamId = window.location.href.split('id=')[1];
        this.streamMessages({ id: streamId });
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  setMessageTopic(messageTopic: any): void {
    console.log('Message topic ==>>', messageTopic);
    this.messageTopic = messageTopic;
  }

  getMorePrivateMessages(): void {
    this.initialMessageCount = this.initialMessageCount + 10;

    const streamDetail = {
      use_first_unread_anchor: true,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'stream',
          operand: this.streamName,
        },
      ],
    };

    // this.store.dispatch(new messagingActions.LoadStreamMessage(streamDetail));

    this.messagingService.getMessagesOfStream(streamDetail).subscribe(
      (response: any) => {
        const allMessages = response.zulip.messages;

        if (this.filteredStreamTopic !== '') {
          this.messagesOfStream = allMessages.filter(
            (message: { subject: string }) =>
              message.subject === this.filteredStreamTopic
          );
        } else {
          this.messagesOfStream = allMessages;
          this.change.detectChanges();
          // get first 10 items from this new array array.slice(0, 10);
          // add the 10 items to the top of the stack
          this.messagesOfStream.unshift(...allMessages.slice(0, 10));
          this.filteredMessagesOfStream = this.messagesOfStream;
          // sort by time. latest last
          // this.messagesOfStream.sort((a, b) =>  a.timestamp - b.timestamp );
          this.change.detectChanges();
        }
        this.change.detectChanges();
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }
}
