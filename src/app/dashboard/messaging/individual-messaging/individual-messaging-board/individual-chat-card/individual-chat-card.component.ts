import {ChangeDetectorRef, Component, DoCheck, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../state/app.state';
import {
  getUserDetails,
  getZulipProfile,
} from '../../../../../auth/state/auth.selectors';
import { Observable } from 'rxjs';
import { oonaFrontendUrl } from '../../../../../../environments/environment';
import * as messagingActions from '../../../state/messaging.actions';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-individual-chat-card',
  templateUrl: './individual-chat-card.component.html',
  styleUrls: ['./individual-chat-card.component.scss'],
})
export class IndividualChatCardComponent implements OnInit {
  @Input() messageDetail: any;
  @ViewChild('currentChat') endChat: ElementRef | undefined;

  messageTime = '';
  zulipProfile!: Observable<any>;
  baseURL = oonaFrontendUrl;
  imageURL = '';
  isVisible = false;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
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
    this.messageTime = new Date(
      this.messageDetail.timestamp * 1000
    ).toLocaleTimeString();
    this.imageURL = `${this.baseURL}${this.messageDetail?.avatar_url}&s=50`;

    this.handleDate();
  }

}
