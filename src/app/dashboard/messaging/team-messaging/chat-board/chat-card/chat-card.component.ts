import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Document } from '@contentful/rich-text-types';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['./chat-card.component.scss']
})
export class ChatCardComponent implements OnInit {
  @Input() messageDetail: any;
  @Output() messageTopic = new EventEmitter<any>();
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

  constructor() {
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

  getMessageTopic(): void {
    this.messageTopic.emit(this.messageDetail.subject);
  }
}
