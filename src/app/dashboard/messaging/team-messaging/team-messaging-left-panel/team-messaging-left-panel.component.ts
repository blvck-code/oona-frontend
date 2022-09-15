import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {MessagingService} from '../../services/messaging.service';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {CreateTeamComponent} from '../create-team/create-team.component';
import {TeamSettingsComponent} from '../team-settings/team-settings.component';
import {OonaSocketService} from '../../services/oona-socket.service';
import {BehaviorSubject, Observable} from 'rxjs';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import {
  getAllStreams,
  getPrivateUnreadMessages, getStreamMessages,
  getStreamUnread,
  getStreamUnreadMessages,
  getTopics
} from '../../state/messaging.selectors';
import {AllStreamsModel, TopicModel} from '../../models/streams.model';
import {delay, take} from 'rxjs/operators';
import {ChannelSettingsComponent} from '../channel-settings/channel-settings.component';
import {SingleMessageModel} from '../../models/messages.model';
import {Topics} from '../../models/topics.model';
import {log} from 'util';


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

  streams$!: Observable<AllStreamsModel[]>;

  topics!: Observable<any>;
  allTopics: any = [];
  privateTopics: any = [];
  publicTopics: any = [];

  streamUnreadCounter: any[] = [];
  finalStream: any[] = [];
  finalStreamSubject = new BehaviorSubject(this.finalStream);
  finalStreamObservable = this.finalStreamSubject.asObservable();

  unreadStreams$!: Observable<SingleMessageModel[]>;
  uniqueId: number[] = [];

  streamTopics: AllStreamsModel[] = [];
  streamTopicsSubject = new BehaviorSubject<AllStreamsModel[]>(this.streamTopics);
  streamTopicObservable = this.streamTopicsSubject.asObservable();

  privateUnreadMsgCounter = 0;
  privateUnreadMsgCounterSubject = new BehaviorSubject(this.privateUnreadMsgCounter);
  privateUnreadMsgCounterObservable = this.privateUnreadMsgCounterSubject.asObservable();

  totalUnreadMsg = 0;
  totalUnreadMsgSubject$ = new BehaviorSubject<number>(this.totalUnreadMsg);
  totalUnreadMsgObservable = this.totalUnreadMsgSubject$.asObservable();

  privateUnread$!: Observable<number>;
  streamUnread$!: Observable<number>;

  streamUnreadCount = 0;
  privateUnreadCount = 0;

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
    this.streams$ = this.store.select(getAllStreams);
    this.streamUnread$ = this.store.select(getStreamUnreadMessages);
    this.privateUnread$ = this.store.select(getPrivateUnreadMessages);

    this.initPageHandler();
    this.handleStreams();
    this.streamsList();
    this.readMessageFlags();
  }

  initPageHandler(): void {
    // handle All Unread Messages
    this.handleUnreadMsgCounter();
    this.handleNewStream();

    // this.streamTopics();
    this.handleSocketsNewMessage();

    // get array of unread messsages
    this.unreadStreams$ = this.store.select(getStreamUnread);

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

  readMessageFlags(): void {
    this.userSocketService.readFlagsObservable.subscribe(
      (readMessage: any) => {
        console.log('Read message flags', readMessage);
      }
    );
  }

  handleNewStream(): void {
    const unique: number[] = [];
    this.userSocketService.newStreamObservable.subscribe(
      (newStreams: any[]) => {
        newStreams.map((stream: AllStreamsModel) => {
          if (unique.includes(stream.stream_id)) { return; }
          if (stream.invite_only) {
            this.privateTopics = [...this.privateTopics, stream];
          } else {
            this.publicTopics = [...this.publicTeams, stream];
          }
          unique.push(stream.stream_id);
        });
      }
    );
  }

  streamsList(): void {
    this.streams$.subscribe(
      streamList => {

        streamList.map((streamItem: AllStreamsModel) => {

          this.messagingService.getTopicsOnStreams(streamItem.stream_id).subscribe(
            (response: any) => {
              const topics = response?.zulip.topics;

              topics.map((topicItem: Topics) => {
                topicItem.unread = 0;
              });

              streamItem = {
                ...streamItem,
                topics,
                unread: 0
              };

              this.streamTopicsSubject.subscribe(
                streams => streams.push(streamItem)
              );

            }
          );

        });

      }
    );
  }

  handleCounter(stream?: AllStreamsModel, topic?: Topics): void {
    const uniqueId: number[] = [];
    // tslint:disable-next-line:max-line-length
    const streamItem: AllStreamsModel = this.allTopics.find((streamContent: AllStreamsModel) => streamContent.stream_id === stream?.stream_id);
    const topicContent = streamItem.topics.find((topicItem: Topics) => topicItem.name.toLowerCase() === topic?.name.toLowerCase());

    if (topic) {
      //
      this.unreadStreams$.subscribe(
        (messages: SingleMessageModel[]) => {
          messages.map((message: SingleMessageModel) => {
            if (message.subject.toLowerCase() === topic.name.toLowerCase() && streamItem.unread > 0) {

              streamItem.topics.map((topicItem: Topics) => {
                // @ts-ignore
                if (topicItem.name.toLowerCase() === topic.name.toLowerCase() && topicItem?.unread > 0) {
                  topicItem.unread ? topicItem.unread -= 1 : topicItem.unread = 0;
                  streamItem.unread -= 1;
                }
              });

            }
          });
        }
      );
    } else {
      // set all topics unread to zero
      streamItem.unread = 0;
      streamItem.topics.map((topicItem: Topics) => {
        topicItem.unread = 0;
      });
    }
    this.allTopics = [...this.allTopics, streamItem];
  }

  handleStreams(): void {
    // Fetch Topics
    this.streams$.subscribe(streams => {
      const uniqueId: number[] = [];
      const uniqueStream: number[] = [];

      take(streams.length),
        streams.map((stream: AllStreamsModel) => {
          const streamId = stream?.stream_id;

          take(1),
            this.messagingService.getTopicsOnStreams(stream.stream_id).subscribe(
              (topicData: any) => {
                this.newTopicsArray = [];

                const topicId = topicData?.oz?.stream_id;
                const topics = topicData?.zulip.topics;

                topics.map((topicItem: Topics) => {
                  topicItem.unread = 0;
                });

                if (topicId === streamId) {
                  stream = {
                    ...stream,
                    topics,
                    unread: 0
                  };

                  this.allTopics = [...this.allTopics, stream];

                  this.unreadStreams$.subscribe(
                    (messages: SingleMessageModel[]) => {
                      messages.map((message: SingleMessageModel) => {

                        if (message.stream_id !== stream.stream_id) { return; }
                        if (uniqueId.includes(message.id)) { return; }

                        if (message.stream_id === stream.stream_id) {
                          this.allTopics.find(
                            (streamItem: AllStreamsModel) => {
                              // tslint:disable-next-line:no-unused-expression
                              if (streamItem.stream_id === stream.stream_id) {
                                streamItem.unread += 1;

                                streamItem.topics.map((topicItem: Topics) => {
                                  if (topicItem.name.toLowerCase() === message.subject.toLowerCase()) {
                                    // @ts-ignore
                                    topicItem.unread += 1;
                                  }
                                });
                              }
                            }
                          );
                        }
                        uniqueId.push(message.id);
                      });
                    }
                  );

                  this.handleStreamCategory();
                  this.change.detectChanges();
                }
              }
            );
        });
    });
  }

  handleStreamCategory(): void {
    this.allTopics.map(
      (item: AllStreamsModel) => {
        if (item.invite_only) {
          this.privateTopics.push(item);
          this.privateTopics = this.privateTopics.filter((v: any, ind: any, s: string | any[]) => {
            return s.indexOf(v) === ind;
          });
          this.privateTopics = this.privateTopics.sort((a: AllStreamsModel, b: AllStreamsModel) => b.unread - a.unread);

        } else {
          this.publicTopics.push(item);
          this.publicTopics = this.publicTopics.filter((v: any, ind: any, s: string | any[]) => {
            return s.indexOf(v) === ind;
          });
          this.publicTopics = this.publicTopics.sort((a: AllStreamsModel, b: AllStreamsModel) => b.unread - a.unread);
        }
      }
    );
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
      this.userSocketService.streamMessageSocket.subscribe(
      (messages: SingleMessageModel[]) => {
       if (!messages.length) { return; }
       this.unreadStreams$.subscribe((streamMessages: SingleMessageModel[]) => {
          messages.map((message: SingleMessageModel) => {

            // console.log('Left panel received message ===>>', message);
            // console.log('Streams ==>>', this.allTopics);

            streamMessages.push(message);
          });
        });
      }
    );
  }

  getStreamName(stream?: any, topic?: any): void {
    // stream
    this.streamName = stream.name;

  }

  handleUnreadMsgCounter(): void {

    this.store.select(getStreamUnreadMessages).subscribe(
      unread => this.streamUnreadCount = unread
    );

    this.store.select(getPrivateUnreadMessages).subscribe(
      unread => this.privateUnreadCount = unread
    );
    this.handleTotalUnread();

  }

  handleTotalUnread(): void {

    this.streamUnread$.subscribe(
      stream => {

        this.privateUnread$.subscribe(
          privateUnread => {
            this.totalUnreadMsgSubject$.next(privateUnread + stream);
          }
        );

      }
    );
  }


  // The public messages topic fetcher
  handlePublicNavigateTopic(stream?: any, topic?: any): void {
    this.checkTopicNavigate(stream, topic);
  }


  // The private messages topic fetcher
  handlePrivateNavigateTopic(stream?: any, topic?: any): void {
    // Todo uncomment this function
    // this.checkTopicNavigate(stream, topic);
    this.handleCounter(stream, topic);
  }

  // Get messages when user clicks a topic name
  checkTopicNavigate(stream?: any, topic?: any): any {
    let streamName = stream?.name;
    streamName = streamName.replace(/\s+/g, '-').toLowerCase();

    const index = this.allTeams.indexOf(stream);

    this.allTeams[index] = stream;
    this.change.detectChanges();

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
    // this.handleCounter(stream, topic);
  }
}



// tslint:disable-next-line:prefer-for-of
// for (let i = 0; i < this.allTopics.length; i++) {
//   if (this.allTopics[i].invite_only === true) {
//     this.privateTopics.push(this.allTopics[i]);
//     this.privateTopics = this.privateTopics.filter((v: any, ind: any, s: string | any[]) => {
//       return s.indexOf(v) === ind;
//     });
//   }
// }
// // tslint:disable-next-line:prefer-for-of
// for (let i = 0; i < this.allTopics.length; i++) {
//   if (this.allTopics[i].invite_only === false) {
//     this.publicTopics.push(this.allTopics[i]);
//     this.publicTopics = this.publicTopics.filter((v: any, ind: any, s: string | any[]) => {
//       return s.indexOf(v) === ind;
//     });
//   }
// }
