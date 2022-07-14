import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Document } from '@contentful/rich-text-types';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import {Router} from '@angular/router';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['./chat-card.component.scss']
})
export class ChatCardComponent implements OnInit {
  @Input() messageDetail: any;
  @Output() messageTopic = new EventEmitter<any>();
  @Output() emitReplyMsg = new EventEmitter<any>();
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
    private route: Router
  ) {
  }

  navigateSubject(message: any): void {
    const stream = `/dashboard/messaging/streams/${+message?.stream_id}-${message?.display_recipient.replace(' ', '-')}`;
    const topic = `topic/${message?.subject.replace(' ', '-')}`;
    const url = `${stream}/${topic}`;
    console.log('Url ===>>>', url);
    this.route.navigate([url]);
    // console.log('Message details ===>>>', message);
  }

  ngOnInit(): void {
    this.messageTime = new Date(this.messageDetail.timestamp * 1000).toLocaleTimeString();
    // tslint:disable-next-line:max-line-length
    // this.messageDate = new Date(this.messageDetail.timestamp).getDate() + '/' + (new Date(this.messageDetail.timestamp).getMonth() + 1) + '/' + new Date(this.messageDetail.timestamp).getFullYear();
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
    navigator.clipboard.writeText(content)
    console.log('Message to copy: ', message?.content);
  }
}
