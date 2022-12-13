import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../state/app.state';
import { getZulipProfile } from '../../../../../auth/state/auth.selectors';
import { Observable } from 'rxjs';
import { oonaFrontendUrl } from '../../../../../../environments/environment';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { selectedUserMessages } from '../../../../state/entities/messages/private.messages.entity';

@Component({
  selector: 'app-individual-chat-card',
  templateUrl: './individual-chat-card.component.html',
  styleUrls: ['./individual-chat-card.component.scss'],
})
export class IndividualChatCardComponent implements OnInit {
  @Input() messageDetail: any;
  @Input() userId$!: Observable<number>;
  @ViewChild('currentChat') endChat: ElementRef | undefined;

  messageTime = '';
  zulipProfile!: Observable<any>;
  // Todo change to end point
  baseURL = 'https://192.168.0.42:3443';
  imageURL = '';
  isVisible = false;

  constructor(private store: Store, private route: ActivatedRoute) {
    this.getUserInfo();
    this.routerDetails();
  }

  routerDetails(): void {
    this.route.queryParams.subscribe((params) => {
      const streamId = params.id;
      const topic = params.topic;
    });
  }

  getUserInfo(): void {
    this.zulipProfile = this.store.select(getZulipProfile);
  }

  showUserInfo(userName: any, zulipName: any): void {
    return userName === zulipName ? `${userName} (Me)` : userName;
  }

  handleDate(): void {
    const time = this.messageDetail.timestamp;
  }

  ngOnInit(): void {
    // this.messageTime = new Date(
    //   this.messageDetail.timestamp * 1000
    // ).toLocaleTimeString();
    // this.messageTime = moment(this.messageDetail.timestamp * 1000).startOf('hours').fromNow();
    this.messageTime = moment(this.messageDetail.timestamp * 1000).calendar();
    this.imageURL = `${this.baseURL}${this.messageDetail?.avatar_url}&s=50`;

    this.handleDate();
    this.routerDetails();
  }
}
