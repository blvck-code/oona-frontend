import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroupPmsServiceService} from '../group-pms-service.service';

@Component({
  selector: 'app-group-pms-chat-card',
  templateUrl: './group-pms-chat-card.component.html',
  styleUrls: ['./group-pms-chat-card.component.scss']
})
export class GroupPmsChatCardComponent implements OnInit {
  @Input() messageDetail: any;
  messageTime = '';

  constructor(
    private groupPmsServiceService: GroupPmsServiceService
  ) { }

  ngOnInit(): void {
    this.messageTime = new Date(this.messageDetail.timestamp * 1000).toLocaleTimeString();
    // console.log(this.messageDetail);
  }

  replyToGroup(): void {
    this.groupPmsServiceService.changeChatGroup(this.messageDetail.display_recipient);
  }
}
