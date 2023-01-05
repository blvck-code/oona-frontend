import { Component, OnInit } from '@angular/core';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../state/app.state';
import {Observable} from 'rxjs';
import {SingleMessageModel} from '../models/messages.model';
import {getUnreadStreamMessages} from '../state/messaging.selectors';
import * as messagingActions from '../state/messaging.actions';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MessagingService} from '../services/messaging.service';
import * as streamMsgAction from '../../state/actions/streams.messages.actions';
import * as streamActions from '../../state/actions/streams.actions';
import {getSelectedStream, getStreams} from '../../state/entities/streams.entity';


@Component({
  selector: 'app-team-messaging',
  templateUrl: './team-messaging.component.html',
  styleUrls: ['./team-messaging.component.scss']
})
export class TeamMessagingComponent implements OnInit {
  unreadMessageId: number[] = [];
  messageUpdate$!: Observable<SingleMessageModel[]>;

  selectedStream$: Observable<number | null> = this.store.select(getSelectedStream);

  constructor(
    private store: Store<AppState>,
    private messageSrv: MessagingService,
    private route: ActivatedRoute,
  ) {
    this.routerDetails();
  }

  routerDetails(): void {
    this.route.queryParams.subscribe(params => {
      const streamId = params.id;
      const topic = params.topic;

      const payload = {
        streamId: +streamId,
        topic: ''
      };

      if (topic){
        payload.topic = topic.replaceAll('-', ' ');
      }


      const topicRequest = {
        anchor: 1750,
        num_before: 50,
        num_after: 50,
        narrow: [
          {
            negated: false,
            operator: 'stream',
            operand: +streamId // stream id
          },
          // {
          //   negated: false,
          //   operator: 'topic',
          //   operand: topic.replaceAll('-', ' ') // topic name
          // }
        ],
        client_gravatar: true
      };
      this.store.dispatch(new streamActions.SelectedStream(payload));
      this.store.dispatch(new streamMsgAction.LoadStreamMsg(topicRequest));

      // this.selectedStream$.subscribe({
      //   // tslint:disable-next-line:no-shadowed-variable
      //   next: (streamId) => {
      //     if ( streamId && +streamId === +streamId) { return; }
      //   }
      // });
    });
  }

  ngOnInit(): void {}

  updateMessageFlags(): void {
    const unreadMessageId: number[] = [];

    this.messageUpdate$.subscribe(
      (messages: SingleMessageModel[]) => {
        messages.map((message: SingleMessageModel) => {
          if (unreadMessageId.includes(message.id)) { return; }

          this.messageSrv.updateMessageFlag(message.id).subscribe(
            (response: any) => {
              const messageId = response.messages[0];
              this.store.dispatch(new messagingActions.UpdateReadMessageSuccess(messageId));
            }
          );
          unreadMessageId.push(message.id);
        });
      });
  }
}
