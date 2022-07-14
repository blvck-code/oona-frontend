import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Params, Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../state/app.state';
import {getAllMessages, getLoadingAllMsg} from '../state/messaging.selectors';
import {SingleMessageModel} from '../models/messages.model';
import * as messagingActions from '../state/messaging.actions';
import {firmName} from '../../../../environments/environment';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.scss']
})
export class StreamsComponent implements OnInit, AfterViewInit {
  currentStream: any;
  streams!: SingleMessageModel;
  public streamSubject = new BehaviorSubject<number>(0);
  public streamSelected = this.streamSubject.asObservable();

  public titleSubject = new BehaviorSubject<string>('');
  public titleSelected = this.titleSubject.asObservable();

  loadingMsgs$!: Observable<boolean>;
  streamName = '';

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
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
        console.log('topicInfo ===>>>', topicInfo);

        const filteredInfo = {
          streamId,
          topicName: undefined
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

  onInitHandler(): void {
    // Todo switching page title bug, not changing as expected
    document.title = `${this.streamName} - ${firmName} - Oona`;
    const currentStream = this.activateRoute.snapshot.params.stream;

    this.titleSelected.subscribe(data => console.log('Current title ===>>>', data));

    // this.currentStream = this.activateRoute.snapshot.params.stream;

    // this.streamSelected.subscribe(data => console.log('Current stream ===>>>', data));



  }

  handleMsgFilter(): void {

    this.store.select(getLoadingAllMsg).subscribe(
      data => {
        if (!data) {
          const selectedStream = this.activateRoute.snapshot.paramMap;

          const streamId = selectedStream?.get('stream')?.split('-')[0];
          const topic = selectedStream?.get('topic');
          const topicInfo = topic?.replace('-', ' ');

          const filteredInfo = {
            streamId,
            topicName: undefined
          };


          if (topicInfo) {
            // @ts-ignore
            filteredInfo.topicName = topicInfo;
          }

          this.store.dispatch(new messagingActions.FilterMessages(filteredInfo));
        }
      }
    )



    // this.activateRoute.params.subscribe(data => console.log('Params ===>>', data));

  }


  ngOnInit(): void {
    this.onInitHandler();
  }

  ngAfterViewInit(): void {
    this.handleMsgFilter();
  }

}
