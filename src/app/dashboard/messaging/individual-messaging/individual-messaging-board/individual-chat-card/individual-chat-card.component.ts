import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../state/app.state';
import {getUserDetails, getZulipProfile} from '../../../../../auth/state/auth.selectors';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-individual-chat-card',
  templateUrl: './individual-chat-card.component.html',
  styleUrls: ['./individual-chat-card.component.scss']
})
export class IndividualChatCardComponent implements OnInit {
  @Input() messageDetail: any;
  messageTime = '';
  zulipProfile!: Observable<any>;

  constructor(
    private store: Store<AppState>,
  ) {
    this.getUserInfo();
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
    this.messageTime = new Date(this.messageDetail.timestamp * 1000).toLocaleTimeString();

    this.handleDate();
  }

  handleReply(message: any): void {
    console.log('Message content ===>>>', message);
  }

}
