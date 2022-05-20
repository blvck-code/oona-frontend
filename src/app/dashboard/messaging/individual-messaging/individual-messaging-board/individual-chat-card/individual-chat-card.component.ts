import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-individual-chat-card',
  templateUrl: './individual-chat-card.component.html',
  styleUrls: ['./individual-chat-card.component.scss']
})
export class IndividualChatCardComponent implements OnInit {
  @Input() messageDetail: any;
  messageTime = '';

  constructor() { }

  ngOnInit(): void {
    this.messageTime = new Date(this.messageDetail.timestamp * 1000).toLocaleTimeString();
  }

}
