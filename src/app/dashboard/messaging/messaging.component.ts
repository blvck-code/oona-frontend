import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

// NgRx
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import * as messagingActions from './state/messaging.actions';
import { MessagesSocketService } from './services/messages-socket.service';
import { getAllStreams, getStreamsLoading } from './state/messaging.selectors';
import { take } from 'rxjs/operators';
import { AllStreamsModel } from './models/streams.model';
import { Observable } from 'rxjs';
import { MessagingService } from './services/messaging.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss'],
})
export class MessagingComponent implements OnInit {
  title = 'Team messaging';
  navTitle = '';
  firstName = '';
  secondName = '';
  streams!: Observable<AllStreamsModel[]>;
  allTopics: any = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private messageSocket: MessagesSocketService,
    private store: Store<AppState>,
    public messagingService: MessagingService
  ) {
    this.messageSocket.messageConnect();
  }

  ngOnInit(): void {
    this.initPage();
    this.getStreams();

    this.authService.getCurrentUser().subscribe((userData: any) => {
      this.firstName = userData.results[0].first_name;
      this.secondName = userData.results[0].last_name;
    });

    this.route.queryParams.subscribe((params) => {
      if (params.member || window.location.href.includes('private')) {
        this.navTitle = 'Private messaging';
      } else if (window.location.href.includes('mentions')) {
        this.navTitle = 'Messaging';
      } else {
        this.navTitle = 'Team messaging';
      }
    });
  }

  initPage(): void {
    this.store.dispatch(new messagingActions.LoadAllStreams());
    this.store.dispatch(new messagingActions.LoadSubStreams());

  }

  logoutUser(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // get streams for left handle
  getStreams(): void {
    this.streams = this.store.select(getAllStreams);

    this.store.select(getAllStreams).subscribe((streams) => {

      take(streams.length),
        streams.map((stream: AllStreamsModel) => {
          const streamId = stream?.stream_id;

          take(1),
            this.messagingService
              .getTopicsOnStreams(stream.stream_id)
              .subscribe(
                // tslint:disable-next-line:no-shadowed-variable
                (data: any) => {
                  const topicId = data?.oz?.stream_id;
                  if (topicId === streamId) {
                    stream = {
                      ...stream,
                      topics: data,
                    };
                    this.allTopics = [...this.allTopics, stream];
                    // console.log('Latest all topics ===>>> ', this.allTopics);
                  }
                }
              );
          // this.store.dispatch(new messagingActions.LoadStreamTopic(item.stream_id));
          // this.streamIds = [...this.streamMessages, item.stream_id];
        });
    });
  }
}
