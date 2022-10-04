import { Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app.state';
import {
  getZulipProfile,
} from '../../../../auth/state/auth.selectors';
import { Observable } from 'rxjs';
import { oonaFrontendUrl } from '../../../../../environments/environment';
import moment from 'moment';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-all-private-messages-card',
  templateUrl: './all-private-messages-card.component.html',
  styleUrls: ['./all-private-messages-card.component.scss']
})
export class AllPrivateMessagesCardComponent implements OnInit {
  @Input() messageDetail: any;
  @Input() userId$!: Observable<number>;
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
    this.routerDetails();
  }

  ngOnInit(): void {
    this.messageTime = moment(this.messageDetail.timestamp * 1000).calendar();
    this.imageURL = `${this.baseURL}${this.messageDetail?.avatar_url}&s=50`;

    this.handleDate();
    this.routerDetails();
  }

  routerDetails(): void {
    this.route.queryParams.subscribe(params => {
      const streamId = params.id;
      const topic = params.topic;
    });
  }

  getUserInfo(): void {
    this.zulipProfile = this.store.select(getZulipProfile);
  }

  handleDate(): void {
    const time = this.messageDetail.timestamp;
  }
}
