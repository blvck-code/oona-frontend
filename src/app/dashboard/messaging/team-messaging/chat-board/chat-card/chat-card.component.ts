import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Document } from '@contentful/rich-text-types';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../state/app.state';
import {getUserDetails, getZulipProfile} from '../../../../../auth/state/auth.selectors';
import moment from 'moment';
import {Observable} from 'rxjs';
import {getAllStreams} from '../../../state/messaging.selectors';
import {AllStreamsModel} from '../../../models/streams.model';
@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['./chat-card.component.scss']
})
export class ChatCardComponent implements OnInit {
  @Input() messageDetail: any;
  @Input() userId$!: Observable<number>;
  @Output() messageTopic = new EventEmitter<any>();
  @Output() emitReplyMsg = new EventEmitter<any>();
  userId: any;
  messageTime = '';
  messageDate: any = '';
  document: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: 'text',
            data: {},
            value: 'Hello World',
            marks: [{ type: 'bold' }],
          },
        ],
      },
    ],
  };

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
  }

  navigateSubject(stream: any): void {
    this.router.navigate(['dashboard/messaging/team'], {
      queryParams: {
        team: stream.name.replace(/\s/g, ''),
        id: stream.stream_id,
      }
    });
  }

  streamName(streamId: number): Observable<string> {
    let currentStream;
    this.store.select(getAllStreams).subscribe(
      (streams: AllStreamsModel[]) => {
        currentStream = streams.find(stream => stream.stream_id === streamId);
      }
    );
    // @ts-ignore
    return currentStream.name;
  }

  ngOnInit(): void {
    this.store.select(getZulipProfile).subscribe(
      (user: any) => this.userId = user.zulip.user_id
    );
    //
    this.messageTime = new Date(this.messageDetail.timestamp * 1000).toLocaleTimeString();
    this.messageDate = new Date(this.messageDetail.timestamp);
    this.document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              data: {},
              value: this.messageDetail,
              marks: [{ type: 'bold' }],
            },
          ],
        },
      ],
    };
  }

  handleReactEmoji(emoji: string): void {
    console.log('Emoji type ====>>>', emoji);
  }

  getMessageTopic(messageDetail: any): void {
    console.log('Message details ===>>>', messageDetail.reactions);
    this.messageTopic.emit(this.messageDetail.subject);
  }

  handleReplyMsg(message: any): void {
    this.emitReplyMsg.emit(message);
  }

  handleCopyMsg(message: any): void {
    const content = message?.content;
    // document.execCommand('copy');
    navigator.clipboard.writeText(content);
    console.log('Message to copy: ', message?.content);
  }
}
