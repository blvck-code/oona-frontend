import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {MessagingService} from '../../services/messaging.service';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {CreateTeamComponent} from '../create-team/create-team.component';
import {TeamSettingsComponent} from '../team-settings/team-settings.component';
import {OonaSocketService} from '../../services/oona-socket.service';
import {BehaviorSubject, Observable} from 'rxjs';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import {getAllStreams, getTopics} from '../../state/messaging.selectors';
import {AllStreamsModel} from '../../models/streams.model';
import {take} from 'rxjs/operators';
import {ChannelSettingsComponent} from '../channel-settings/channel-settings.component';
import {SingleMessageModel} from '../../models/messages.model';
import {getAllUsers} from '../../../../auth/state/auth.selectors';
import {Title} from '@angular/platform-browser';


interface TopicDetails {
  topic_name: string;
  max_id: number;
  count: number;
}


@Component({
  selector: 'app-team-messaging-left-panel',
  templateUrl: './team-messaging-left-panel.component.html',
  styleUrls: ['./team-messaging-left-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TeamMessagingLeftPanelComponent implements OnInit {
  newTopicsArray: TopicDetails[] = [];

  allTeams: any;
  streamName: any;
  publicTeams: any = [];
  private allAvailableTeams: any;
  @Output() topicToDisplay = new EventEmitter<any>();
  displayCreateTeamComponentRef: MatDialogRef<CreateTeamComponent> | undefined;
  displayTeamSettingsComponentRef: MatDialogRef<TeamSettingsComponent> | undefined;
  displayCreatChannelComponentRef: MatDialogRef<ChannelSettingsComponent> | undefined;
  allUsers = Array();
  pmNames = Array();
  privateChatMembers = Array();
  loggedInUserProfile: any;
  private privateAndPublicTeams: any;
  private privateAndPublicChannels: any;
  newMessagesCount: number | undefined;
  streamMessages = Array();
  streams!: Observable<AllStreamsModel[]>;
  topics!: Observable<any>;
  allTopics: any = [];
  privateTopics: any = [];
  publicTopics: any = [];

  streamUnreadCounter: any[] = [];
  finalStream: any[] = [];
  finalStreamSubject = new BehaviorSubject(this.finalStream);
  finalStreamObservable = this.finalStreamSubject.asObservable();

  unreadCount = [];
  unreadMessagesSubject = new BehaviorSubject(this.unreadCount);
  unreadMessagesObservable = this.unreadMessagesSubject.asObservable();

  streamsUnreadMsgCounter = 0;
  streamsUnreadMsgCounterSubject = new BehaviorSubject(this.streamsUnreadMsgCounter);
  streamsUnreadMsgCounterObservable = this.streamsUnreadMsgCounterSubject.asObservable();

  privateUnreadMsgCounter = 0;
  privateUnreadMsgCounterSubject = new BehaviorSubject(this.privateUnreadMsgCounter);
  privateUnreadMsgCounterObservable = this.privateUnreadMsgCounterSubject.asObservable();

  totalUnreadMsg = 0;
  totalUnreadMsgSubject$ = new BehaviorSubject<number>(this.totalUnreadMsg);
  totalUnreadMsgObservable = this.totalUnreadMsgSubject$.asObservable();

  constructor(
    public messagingService: MessagingService,
    private router: Router,
    private dialog: MatDialog,
    private change: ChangeDetectorRef,
    private userSocketService: OonaSocketService,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit(): void {
    // fire on page load handler
    this.initPageHandler();
  }

  getUnreadMessageCounter(): void {
    this.messagingService.totalUnreadMsgCounterObservable.subscribe(
      numb => {
        console.log('Really?? ', numb);
        this.totalUnreadMsgSubject$.next(numb);
      }
    );
  }

  initPageHandler(): void {
    // handle All Unread Messages
    this.getUnreadMessageCounter();

    // this.streamTopics();
    this.handleSocketsNewMessage();

    // Fetch streams
    this.streams = this.store.select(getAllStreams);


    // Fetch Topics
    this.streams.subscribe(streams => {


      take(streams.length),
        streams.map((stream: AllStreamsModel) => {
          const streamId = stream?.stream_id;

          // streamDetail.stream_name = stream.name;
          // streamDetail.stream_id = stream.stream_id;

          take(1),
            this.messagingService.getTopicsOnStreams(stream.stream_id).subscribe(
              (topicData: any) => {
                this.newTopicsArray = [];
                const topicId = topicData?.oz?.stream_id;

                if (topicId === streamId) {
                  stream = {
                    ...stream,
                    topics: topicData,
                  };
                  this.allTopics = [...this.allTopics, stream];

                  // tslint:disable-next-line:prefer-for-of
                  for (let i = 0; i < this.allTopics.length; i++) {
                    if (this.allTopics[i].invite_only === true) {
                      this.privateTopics.push(this.allTopics[i]);
                      this.privateTopics = this.privateTopics.filter((v: any, ind: any, s: string | any[]) => {
                        return s.indexOf(v) === ind;
                      });
                    }
                  }
                  // tslint:disable-next-line:prefer-for-of
                  for (let i = 0; i < this.allTopics.length; i++) {
                    if (this.allTopics[i].invite_only === false) {
                      this.publicTopics.push(this.allTopics[i]);
                      this.publicTopics = this.publicTopics.filter((v: any, ind: any, s: string | any[]) => {
                        return s.indexOf(v) === ind;
                      });
                    }
                  }

                  this.change.detectChanges();
                }
              }
            );
        });
      setTimeout(() => {
        this.handleUnreadMsgCounter();
      }, 1000);
    });

    setTimeout(() => {

      this.messagingService.totalUnreadMsgObservable.subscribe(
        messages => console.log('Unreads =.', messages)
      );
    }, 3000);

    // Get Topics from store
    this.topics = this.store.select(getTopics);

    this.listAllTeams();
    this.userSocketService.streamMessageSocket.subscribe(messages => {
      this.streamMessages = messages;
      this.updateTeamsWithMessageCount(messages);
    });
    this.messagingService.currentPmNames.subscribe((pmNames) => {
      this.pmNames = this.removeDuplicates(this.createArrayOfPms(pmNames)); // always get the current value
    });

    this.messagingService.currentUserProfile().subscribe((profile: any) => {
      this.loggedInUserProfile = profile;
    });

    // handle unread stream message counter
  }

  listAllTeams(): any {
    this.messagingService.getAllTeams().subscribe((teams: any) => {
      this.privateAndPublicTeams = teams.streams;
      // display only teams that are private here
      this.allTeams = teams.streams.filter((team: { invite_only: any; }) => team.invite_only);
      this.publicTeams = teams.streams.filter((team: { invite_only: any; }) => !team.invite_only);
      // this.streamTopics(teams.streams);
    });
  }

  removeDuplicates(data: any): any {
    // tslint:disable-next-line:max-line-length
    return data.filter((value: { id: any; }, index: any, array: { id: any; }[]) => array.findIndex((item: { id: any; }) => (item.id === value.id)) === index);
  }

  createArrayOfPms(pmNamesArray: any[]): any {
    pmNamesArray.forEach((chatGroup: any) => {
      this.privateChatMembers.push(...chatGroup);
    });
    return this.privateChatMembers;
  }

  getPublicStreamDetails(team: any): void {
    // find the index of this team within all the teams
    const index = this.publicTeams.indexOf(team);

    this.messagingService.getTopicsOnStreams(team.stream_id).subscribe((topicResults: { zulip: { topics: any; }; }) => {
      team.topics = topicResults.zulip.topics;
    });

    this.publicTeams[index] = team;
    this.change.detectChanges();
    this.router.navigate(['dashboard/messaging/team'], {
      queryParams: {
        team: team.name.replace(/\s/g, ''),
        id: team.stream_id
      }
    });
  }

  teamSettings(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '80vh';
    dialogConfig.width = '70vw';
    dialogConfig.data = {allTeams: this.privateAndPublicTeams};
    this.displayTeamSettingsComponentRef = this.dialog.open(TeamSettingsComponent, dialogConfig);
    this.displayTeamSettingsComponentRef.afterClosed().subscribe(
      data => {
        if (data === 'success') {
          this.listAllTeams();
        }
      }
    );
  }

  channelSettings(): void {
    const dialogRef = this.dialog.open(ChannelSettingsComponent, {
      height: '20rem',
      width: '25rem',
      data: {
        name: this.streamName,
      }
    });
  }

  private updateTeamsWithMessageCount(messages: any[]): void {
    if (messages.length > 0) {
      this.allTeams.forEach((team: { messageCount: number; stream_id: any; }) => {
        team.messageCount = messages.filter(message => message.stream_id === team.stream_id).length;
      });

      this.publicTeams.forEach((team: { messageCount: number; stream_id: any; }) => {
        team.messageCount = messages.filter(message => message.stream_id === team.stream_id).length;
      });
    }
  }

  handleSocketsNewMessage(): void {
    this.userSocketService.allMsgCounterObservable.subscribe(
      newMessage => {
        if (newMessage === 0) {
          return;
        } else {
          // update all messages counter
          const newTotal = this.totalUnreadMsg += 1;
          this.totalUnreadMsgSubject$.next(newTotal);

          // update private messages counter
          const newTotalPrivateMsg = this.privateUnreadMsgCounter += 1;
          this.privateUnreadMsgCounterSubject.next(newTotalPrivateMsg);
        }
      }
    );


    this.userSocketService.newMsgCounterObservable.subscribe(
      message => console.log('New socket message ===>>>', message)
    );
  }

  getStreamName(stream?: any, topic?: any): void {
    // stream
    this.streamName = stream.name;

  }

  handleUnreadMessage(): any {
    // get streams unread messages
    this.store.select(getAllStreams).subscribe(streams => {
      // console.log('Stream details ===>>>>', streams);

      streams?.map((user: any) => {

        const streamDetail = {
          anchor: 'newest',
          num_before: 100,
          num_after: 0,
          type: [
            {
              operator: 'stream',
              operand: user?.name
            }
          ]
        };

        this.messagingService.getMessagesOfStream(streamDetail).subscribe(
          (response: any) => {
            // console.log('Getting messages from all users ===>>>', response);
            const messages = response?.zulip?.messages;
            // console.log('stream messages ', messages?.length);

            const res = messages.reduce((x: any, cur: any) => {
              const item = cur.flags.includes('read');
              if (!x[item]) {
                x[item] = 0;
              }
              x[item] = x[item] + 1;
              return x;
            }, {});

            // tslint:disable-next-line:forin
            for (const key in res) {
              const count = res[key];
              const data = key.slice(0, 2);
              const service = key.slice(2);
              this.unreadCount.push({
                // @ts-ignore
                count
              });
            }
            // console.log('The unread count ===>', this.unreadCount[1]);
            messages?.forEach((msg: SingleMessageModel) => {
              if (msg) {
                if (msg.flags.includes('read')) {
                  // console.log('returned');
                } else {
                  // update new stream unread messags
                  const newCount = this.streamsUnreadMsgCounter += 1;
                  this.streamsUnreadMsgCounterSubject.next(newCount);

                  // update new total unread messages
                  const newTotal = this.totalUnreadMsg += 1;
                  this.totalUnreadMsgSubject$.next(newTotal);
                }
              }

            });

          }
        );
      });
    });

    // get private unread messages
    this.store.select(getAllUsers).subscribe(users => {
      users?.map((user: any) => {

        const streamDetail = {
          anchor: 'newest',
          num_before: 100,
          num_after: 0,
          type: [
            {
              operator: 'pm-with',
              operand: user?.email
            }
          ]
        };

        this.messagingService.getMessagesOfStream(streamDetail).subscribe(
          (response: any) => {
            // console.log('Getting messages from all users ===>>>', response);
            const messages = response?.zulip?.messages;
            // console.log('stream messages ', messages?.length);

            const res = messages.reduce((x: any, cur: any) => {
              const item = cur.flags.includes('read');
              if (!x[item]) {
                x[item] = 0;
              }
              x[item] = x[item] + 1;
              return x;
            }, {});

            // tslint:disable-next-line:forin
            for (const key in res) {
              const count = res[key];
              const data = key.slice(0, 2);
              const service = key.slice(2);
              this.unreadCount.push({
                // @ts-ignore
                count
              });
            }
            // console.log('The unread count ===>', this.unreadCount[1]);
            messages?.forEach((msg: SingleMessageModel) => {
              if (msg) {
                if (msg.flags.includes('read')) {
                  // console.log('returned');
                } else {
                  // update counter for private unread messages
                  const newCount = this.privateUnreadMsgCounter += 1;
                  this.privateUnreadMsgCounterSubject.next(newCount);

                  // update new total unread messages
                  const newTotal = this.totalUnreadMsg += 1;
                  this.totalUnreadMsgSubject$.next(newTotal);

                }
              }
            });
          }
        );
      });
    });

  }

  handleUnreadMsgCounter(): void {

    const streamArray: any[] = [];
    const topicSubjects: string[] = [];

    this.streamUnreadCounter.map((counter: { stream_id: number, counter: number, name: string, topics: { topics: any[] } }) => {


      const unreadContent = {
        name: counter.name,
        stream_id: counter.stream_id,
        unreadCount: 0,
        topics: counter.topics
      };


      this.messagingService.streamsUnreadMsgArrayObservable.subscribe((unreadStreams: SingleMessageModel[]) => {
        unreadStreams.map((unreadStream: SingleMessageModel) => {


          take(1);
          if (+unreadStream.stream_id === +counter.stream_id) {
            // adding counter for all unread messages of the stream
            unreadContent.unreadCount += 1;

            if (topicSubjects.includes(unreadStream.subject.toLowerCase())) {
              return;
            } else {
              topicSubjects.push(unreadStream.subject.toLowerCase());

              counter.topics.topics.map((topic: any) => {
                topic.unread = 0;

                topicSubjects.map((topicName: string) => {
                  // console.log('Topic ===>>>', topicSubjects)

                  if (topic.name.toLowerCase() === topicName.toLowerCase()) {
                    // adding counter for single topic unread
                    topic.unread += 1;

                  } else {
                    topic.unread = 0;
                  }
                });
              });
            }
          }
        });

      });

      streamArray.push(unreadContent);

    });

    this.finalStreamSubject.next(streamArray);

  }


  // Todo filter unread messages here to update on ui
  filterUnreadStream(msg: SingleMessageModel): void {
    const unreadMsgContent = {
      stream: msg.display_recipient,
      topic: msg.subject,
      msgId: msg.id
    };
    console.log('Total unread messages ====>>>>>');
  }

  // The public messages topic fetcher
  handlePublicNavigateTopic(stream?: any, topic?: any): void {
    this.checkTopicNavigate(stream, topic);
  }

  // The private messages topic fetcher
  handlePrivateNavigateTopic(stream?: any, topic?: any): void {
    //
    this.checkTopicNavigate(stream, topic);
  }

  // Get messages when user clicks a topic name
  checkTopicNavigate(stream?: any, topic?: any): any {
    let streamName = stream?.name;
    streamName = streamName.replace(/\s+/g, '-').toLowerCase();

    const index = this.allTeams.indexOf(stream);

    this.allTeams[index] = stream;
    this.change.detectChanges();
    // this.router.navigate(['dashboard/messaging/team'], {
    //   queryParams: {
    //     team: stream.name.replace(/\s/g, ''),
    //     id: stream.stream_id
    //   }
    // });

    if (topic) {
      this.router.navigate(['dashboard/messaging/team'], {
        queryParams: {
          team: stream.name.replace(/\s/g, ''),
          id: stream.stream_id,
          topic: topic.name.replace(/\s/g, '-'),
        }
      });
    } else {
      this.router.navigate(['dashboard/messaging/team'], {
        queryParams: {
          team: stream.name.replace(/\s/g, ''),
          id: stream.stream_id
        }
      });
    }
  }
}
