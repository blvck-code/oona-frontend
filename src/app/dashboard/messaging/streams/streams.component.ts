import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../state/app.state';
import {getAllMessages} from '../state/messaging.selectors';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.scss']
})
export class StreamsComponent implements OnInit {
  currentStream: string = '';

  constructor(
    private activateRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {
  }

  onInitHandler(): void {

    this.currentStream = this.activateRoute.snapshot.params.stream;
    console.log('Current stream ===>>>', this.currentStream);

    this.store.select(getAllMessages).subscribe(
      streams => {
        // @Todo redirect if no data or no currentStream
        if (streams) {
          streams.map(stream => {
            const streamName = stream.display_recipient;

            if (streamName === this.currentStream) {
              console.log('Stream content ===>>>', stream);
            }
          });
        }
      }
    );

  }



  ngOnInit(): void {
    this.onInitHandler();
  }

}
