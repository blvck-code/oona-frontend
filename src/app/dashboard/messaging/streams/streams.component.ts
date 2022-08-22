import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Params,
  Router,
} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

// NgRx
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import {
  getAllMessages, getAllStreamData,
  getAllStreams,
  getLoadingAllMsg,
} from '../state/messaging.selectors';
import { SingleMessageModel } from '../models/messages.model';
import * as messagingActions from '../state/messaging.actions';
import { firmName } from '../../../../environments/environment';
import {map, take} from 'rxjs/operators';
import { MessagingService } from '../services/messaging.service';
import {HandleStreamData} from '../state/messaging.actions';
import {OonaSocketService} from '../services/oona-socket.service';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.scss'],
})
export class StreamsComponent implements OnInit, AfterViewInit {
  currentStream: any;
  streams!: SingleMessageModel;
  public streamSubject = new BehaviorSubject<number>(0);
  public streamSelected = this.streamSubject.asObservable();
  streamInfo: any;

  selectedStreamId: any;

  public titleSubject = new BehaviorSubject<string>('');
  public titleSelected = this.titleSubject.asObservable();
  initialMessageCount = 10;

  loadingMsgs$!: Observable<boolean>;
  streamName = '';
  privateMessages = Array();

  unreadStreamMsgIds: number[] = [];
  unreadStreamMsgSubject = new BehaviorSubject<number[]>(this.unreadStreamMsgIds);
  unreadStreamMsgObservable = this.unreadStreamMsgSubject.asObservable();

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private activateRoute: ActivatedRoute,
    private messageSrv: MessagingService,
  ) {
    // @ts-ignore
    this.router.events.subscribe((event: Event) => {
      const selectedStream = this.activateRoute.snapshot.paramMap;

      const streamId = selectedStream?.get('stream')?.split('-')[0];
      const topicInfo = selectedStream?.get('topic')?.replace('-', ' ');

      if (event instanceof NavigationStart) {
        const streamName = selectedStream?.get('stream')?.split('-')[1];
        // @ts-ignore

        if (topicInfo) {
          this.titleSubject.next(topicInfo);
        }
        // @ts-ignore
        this.titleSubject.next(streamName);
      }

      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar
        // this.currentRoute = event.url;

        const filteredInfo = {
          streamId,
          topicName: undefined,
        };

        if (topicInfo) {
          // @ts-ignore
          filteredInfo.topicName = topicInfo;
          // @ts-ignore
          this.streamName = topicInfo;
        }

        // @ts-ignore
        this.streamName = selectedStream?.get('stream')?.split('-')[1];
        // this.store.dispatch(new messagingActions.FilterMessages(filteredInfo));

        this.handleMsgFilter();
      }

      if (event instanceof NavigationError) {
        // Hide progress spinner or progress bar
      }
    });
  }

  changeOnRouter(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.getStreamsMessages();
        const route = this.activateRoute.snapshot.paramMap;

        const streamId = route.get('stream')?.split('-')[0];
        const currentStream = route.get('stream')?.split('-')[1];

        console.log('Selected stream id', streamId)

        this.selectedStreamId = streamId;

        const topic = route.get('topic');

        const streamData = {
          id: streamId,
          streamName: currentStream,
          streamTopic: topic ? topic : 'new streams',
        };

        this.streamInfo = streamData;

      }
    });
  }

  onInitHandler(): void {
    // Todo switching page title bug, not changing as expected
    document.title = `${this.streamName} - ${firmName} - Oona`;
    const currentStream = this.activateRoute.snapshot.params.stream;

    this.changeOnRouter();
    this.getStreamsMessages();
    // get Unread messages
    this.getUnreadStreamMessage();
    // get activated route details
  }

  getUnreadStreamMessage(): void {
    const newArray: number[] = []
    take(1)
    this.messageSrv.streamsUnreadMsgArrayObservable
      .subscribe(
        (messages: SingleMessageModel[]) => messages?.map(
          (message: SingleMessageModel) => {

            if(+message.stream_id === +this.selectedStreamId){

              if(this.unreadStreamMsgIds.includes(message.id)){
                return
              }
                newArray.push(message.id);
              console.log('Messages ids ===>>>', message.id);
                this.unreadStreamMsgIds.push(message.id);
                this.unreadStreamMsgSubject.next(newArray);
            }
          }
        )
      );

    console.log('All stream unread messages ===>>>', this.unreadStreamMsgIds)

    // this.messageSrv.updateReadMessagesFlags(this.unreadStreamMsgObservable)
    setTimeout(() => {
      this.messageSrv.updateReadMessagesFlags(this.unreadStreamMsgIds)
    }, 500)

  }

  getStreamsMessages(): void {
    const route = this.activateRoute.snapshot.paramMap;

    const streamId = route.get('stream')?.split('-')[0];
    const currentStream = route.get('stream')?.split('-')[1];

    const streamDetail = {
      anchor: 'newest',
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'stream',
          operand: currentStream,
        },
      ],
    };

    this.store.dispatch(new messagingActions.LoadPrivateMessages(streamDetail));
  }

  handleMsgFilter(): void {
    this.store.select(getLoadingAllMsg).subscribe((data) => {
      if (!data) {
        const selectedStream = this.activateRoute.snapshot.paramMap;

        const streamId = selectedStream?.get('stream')?.split('-')[0];
        const topic = selectedStream?.get('topic');
        const topicInfo = topic?.replace('-', ' ');

        const filteredInfo = {
          streamId,
          topicName: undefined,
        };

        if (topicInfo) {
          // @ts-ignore
          filteredInfo.topicName = topicInfo;
        }

        this.store.dispatch(new messagingActions.FilterMessages(filteredInfo));
      }
    });

    // this.activateRoute.params.subscribe(data => console.log('Params ===>>', data));
  }


  ngOnInit(): void {
    this.onInitHandler();
  }

  ngAfterViewInit(): void {
    this.handleMsgFilter();
  }



  sortMessages(): void{
    this.privateMessages.sort((a, b ) => a.timestamp - b.timestamp).map(
      streamMsg => console.log('Stream message ===>>>', streamMsg)
    );
  }

}
