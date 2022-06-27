import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import {getAllMessages} from '../../state/messaging.selectors';
import {SingleMessageModel} from '../../models/messages.model';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-streams-board',
  templateUrl: './streams-board.component.html',
  styleUrls: ['./streams-board.component.scss']
})
export class StreamsBoardComponent implements OnInit {
  currentStream = '';
  selectedStream!: [];
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
        // console.log('Route change detected ===>>>', event);
      }

      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar
        // this.currentRoute = event.url;
        const streamInfo = this.activateRoute.snapshot.paramMap.get('stream');
        const streamId = streamInfo?.split('-')[0];

        // console.log('Complicated slug ====>>>', this.activateRoute.snapshot.paramMap);

        // @ts-ignore
        this.streamSubject.next(+streamId);
        //
        // this.store.select(getAllMessages).subscribe(
        //   streams => {
        //     // @Todo redirect if no data or no currentStream
        //     if (streams) {
        //       streams.map(stream => {
        //         // console.log('Streams content ==>>>', stream.stream_id);
        //         //
        //         const streamName = stream.display_recipient;
        //         let currentStreamId = 0;
        //
        //         this.streamSelected.subscribe(
        //           data => currentStreamId = data
        //         );
        //
        //         if (stream.stream_id === currentStreamId) {
        //           // console.log('Selected stream ===>>', typeof stream);
        //           // @ts-ignore
        //           // this.selectedStream.push(stream);
        //           // this.selectedStream = [...this.selectedStream, stream];
        //           // console.log(this.selectedStream);
        //
        //         }
        //
        //       });
        //     }
        //   }
        // );

      }

      if (event instanceof NavigationError) {
        // Hide progress spinner or progress bar
      }
    });
  }

  onInitHandler(): void {

    const currentStream = this.activateRoute.snapshot.params.stream;



    this.currentStream = this.activateRoute.snapshot.params.stream;

    // this.streamSelected.subscribe(data => console.log('Current stream ===>>>', data));


  }

  ngOnInit(): void {
    this.onInitHandler();

  }

}
