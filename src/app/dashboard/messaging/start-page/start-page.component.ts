import { Component, Input, OnInit } from '@angular/core';
import { firmName } from '../../../../environments/environment';
// NgRx
import { Store } from '@ngrx/store';
import * as messagingActions from '../state/messaging.actions';
import { AppState } from '../../../state/app.state';
import {MessagingService} from "../services/messaging.service";
import {SingleMessageModel} from "../models/messages.model";

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent implements OnInit {
  @Input() public users: any;

  constructor(
    private store: Store<AppState>,
    private messagingSrv: MessagingService
  ) {}

  onIniHandler(): void {
    this.updateReadMessages();

    const payload = {
      anchor: ''
    };
  }

  updateReadMessages(): void {
    let unreadMsgId: any[] = [];

    setTimeout(() => {
      this.messagingSrv.totalUnreadMsgObservable
        .subscribe((unreadMessages: SingleMessageModel[]) => {

          unreadMessages.map((msg: SingleMessageModel) => {
            unreadMsgId.push(msg.id);
            // console.log('All unread messages ===>>>', msg)
          });

        });
    }, 500);

    // this.messagingSrv.updateReadMsgFlag();

  }

  ngOnInit(): void {
    this.onIniHandler();
  }
}
