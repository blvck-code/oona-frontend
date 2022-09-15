import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { MessagingService } from '../../services/messaging.service';

import TurndownService from 'turndown';
import {HomeService} from '../../../home/shared/home.service';
import {OonaSocketService} from '../../services/oona-socket.service';
import * as messagingActions from '../../state/messaging.actions';
import {getSelectedStreamMessages, getSelectedTopic} from '../../state/messaging.selectors';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import {Observable} from 'rxjs';
import {SingleMessageModel} from '../../models/messages.model';
import {log} from 'util';

const turndownService = new TurndownService();

@Component({
  selector: 'app-chat-board',
  templateUrl: './chat-board.component.html',
  styleUrls: ['./chat-board.component.scss'],
})
export class ChatBoardComponent implements OnInit {
  streamDetails = {};
  streamName = '';
  messagesOfStream = Array();
  filteredMessagesOfStream = Array();
  messageDate: Date = new Date();
  messageTopic: any;
  filteredStreamTopic = '';
  latItemTopic: any;
  initialMessageCount =  30;
  newMessagesCount: number | undefined;
  selectedStreamMessages$!: Observable<SingleMessageModel[]>;
  topicSelected = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private messagingService: MessagingService,
    private change: ChangeDetectorRef,
    private router: Router,
    private userSocketService: OonaSocketService,
    private store: Store<AppState>
  ) {
    this.routerDetails();
  }

  routerDetails(): void {
    this.route.queryParams.subscribe(params => {
      const streamId = params.id;
      const topic = params.topic;

      const payload = {
        streamId: +streamId,
        topic: ''
      };

      if (topic){
        payload.topic = topic.replaceAll('-', ' ');
      }

      // this.store.dispatch(new messagingActions.SelectedStreamId(+streamId));
      this.store.dispatch(new messagingActions.SelectedStreamId(payload));

      this.handleStreamContent(topic);

    });
  }

  storeStreamMessages(): void {
    this.selectedStreamMessages$ = this.store.select(getSelectedStreamMessages);
    console.log('Selected topic =>', this.topicSelected);
    console.log('Selected topic =>', this.messageTopic);
    this.store.select(getSelectedStreamMessages).subscribe(
      (messages: SingleMessageModel[]) => {
        {
          this.loading = false;
        }
        // console.log('Stream messages =>', messages)
      }
    );
  }

  handleStreamContent(topic?: string): void {

    this.store.select(getSelectedStreamMessages).subscribe(
      (messages: SingleMessageModel[]) => {

        if (topic) {
          messages.filter((message: SingleMessageModel) =>
            message.subject.toLowerCase() === topic);
        }

      }
    );
  }

  ngOnInit(): void {
    this.store.select(getSelectedTopic).subscribe(
      (topicName: string) => {
        if (topicName) {
          this.messageTopic = topicName;
        } else {
          this.messageTopic = 'new streams';
        }
      }
    );

    this.storeStreamMessages();
    this.messagingService.currentStreamName.subscribe((streamName) => {
      this.streamName = streamName; // always get the current value
    });

    this.route.queryParams.subscribe((params) => {
      this.streamMessages(params);
      this.userSocketService.messageCount.subscribe(messages => {
        this.newMessagesCount = messages;
        this.streamMessages(params);
      });
    });
    this.messagingService.currentStreamTopic.subscribe((streamTopic) => {
      this.filteredStreamTopic = streamTopic; // always get the current value
      this.filterMessagesByTopic(streamTopic);
    });
  }

  streamMessages(streamParamDetail: any): void {
    this.messagingService.getAllTeams().subscribe((teams: any) => {
      const streamName = teams.streams.find((team: { stream_id: any; }) => team?.stream_id === Number(streamParamDetail.id)).name;
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
          const lastItem = this.messagesOfStream[
          this.messagesOfStream.length - 1
            ];
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
      (response: any) => {
        // re-fetch messages with pm
        const streamId = window.location.href.split('id=')[1];
        this.streamMessages({id: streamId});
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  setMessageTopic(messageTopic: any): void {
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

  private filterMessagesByTopic(streamTopic: string): void {

    if (streamTopic !== ''){
      this.filteredMessagesOfStream = this.messagesOfStream.filter(
        (message: { subject: string }) =>
          message.subject === streamTopic
      );
    }else{
      this.filteredMessagesOfStream = this.messagesOfStream;
    }
    this.change.detectChanges();
  }
}
