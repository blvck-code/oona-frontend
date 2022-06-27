import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Params, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../state/app.state';
import {getAllMessages} from '../state/messaging.selectors';
import {SingleMessageModel} from '../models/messages.model';
import * as messagingActions from '../state/messaging.actions';

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

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    // @ts-ignore
    this.router.events.subscribe((event: Event) => {

      if (event instanceof NavigationStart) {

      }

      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar
        // this.currentRoute = event.url;
        const selectedStream = this.activateRoute.snapshot.paramMap;

        const streamId = selectedStream?.get('stream')?.split('-')[0];
        const topicInfo = selectedStream?.get('topic')?.replace('-', ' ');

        const filteredInfo = {
          streamId,
          topicName: undefined
        };

        if (topicInfo) {
          // @ts-ignore
          filteredInfo.topicName = topicInfo;
        }
        // this.store.dispatch(new messagingActions.FilterMessages(filteredInfo));

        this.handleMsgFilter();
      }

      if (event instanceof NavigationError) {
        // Hide progress spinner or progress bar
      }

    });
  }

  onInitHandler(): void {

    const currentStream = this.activateRoute.snapshot.params.stream;

    // this.currentStream = this.activateRoute.snapshot.params.stream;

    this.streamSelected.subscribe(data => console.log('Current stream ===>>>', data));



  }

  handleMsgFilter(): void {
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
    // this.activateRoute.params.subscribe(data => console.log('Params ===>>', data));

  }


  ngOnInit(): void {
    this.onInitHandler();
  }

  ngAfterViewInit() {
    this.handleMsgFilter();
  }

}
