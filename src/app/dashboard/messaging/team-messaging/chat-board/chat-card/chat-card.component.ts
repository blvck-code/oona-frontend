import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Document } from '@contentful/rich-text-types';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../state/app.state';
import {
  getUserDetails,
  getUserId,
  getZulipProfile,
} from '../../../../../auth/state/auth.selectors';
import moment from 'moment';
import { Observable } from 'rxjs';
import { getAllStreams } from '../../../state/messaging.selectors';
import { AllStreamsModel } from '../../../models/streams.model';
import { getStreams } from '../../../../state/entities/streams.entity';
import { SubStreamsModel } from '../../../../models/streams.model';
import * as streamMsgActions from '../../../../state/actions/streams.messages.actions';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { DashService } from '../../../../service/dash-service.service';
import { UpdateStreamMessageFlag } from '../../../../state/actions/streams.messages.actions';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['./chat-card.component.scss'],
})
export class ChatCardComponent implements OnInit {
  @Input() messageDetail: any;
  @Output() messageTopic = new EventEmitter<any>();
  @Output() emitReplyMsg = new EventEmitter<any>();

  userId$: Observable<any> = this.store.select(getUserId);
  @ViewChild('intersection') 'intersection': ElementRef;

  userId: any;
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
    private router: Router,
    private store: Store<AppState>,
    private dashSrv: DashService
  ) {}

  handleReadFlag(): void {
    if (this.messageDetail?.flags.includes('read')) {
      return;
    }

    setTimeout(() => {
      this.chatObserver(this.intersection).subscribe({
        next: (isVisible) => {
          if (isVisible) {
            // dispatch unread flags
            const updateContent = {
              messages: [this.messageDetail.id],
              flag: 'read',
              op: 'add',
            };

            this.dashSrv.updateMessageFlags(updateContent).subscribe({
              next: (resp) => {
                if (resp.result === 'success') {
                  this.store.dispatch(
                    new streamMsgActions.UpdateStreamMessageFlag({
                      messages: this.messageDetail.id,
                      flag: [...this.messageDetail.flags, 'read'],
                    })
                  );
                }
              },
            });
          }
        },
      });
    }, 1000);
  }

  chatObserver(element: ElementRef): Observable<boolean> {
    return new Observable((observe) => {
      const intersectionObserver = new IntersectionObserver((entries) => {
        observe.next(entries);
      });

      intersectionObserver.observe(element.nativeElement);

      return () => {
        intersectionObserver.disconnect();
      };
    }).pipe(
      // @ts-ignore
      switchMap((entries: IntersectionObserverEntry) => entries),
      map((entry: any) => entry.isIntersecting),
      distinctUntilChanged()
    );
  }

  navigateSubject(stream: any): void {
    this.router.navigate(['dashboard/messaging/team'], {
      queryParams: {
        team: stream.name.replace(/\s/g, ''),
        id: stream.stream_id,
      },
    });
  }

  // streamName(streamId: number): Observable<string> {
  //   let currentStream;
  //   this.store.select(getStreams).subscribe(
  //     (streams: SubStreamsModel[]) => {
  //       currentStream = streams.find(stream => stream.stream_id === streamId);
  //     }
  //   );
  //   // @ts-ignore
  //   return currentStream.name;
  // }

  ngOnInit(): void {
    this.handleReadFlag();
    this.store
      .select(getZulipProfile)
      .subscribe((user: any) => (this.userId = user.zulip.user_id));
    //
    this.messageTime = moment(this.messageDetail.timestamp * 1000).calendar();
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
    navigator.clipboard.writeText(content);
    console.log('Message to copy: ', message?.content);
  }
}
