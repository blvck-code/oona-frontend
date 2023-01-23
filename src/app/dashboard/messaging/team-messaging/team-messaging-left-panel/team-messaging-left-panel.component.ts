import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { MessagingService } from '../../services/messaging.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { CreateTeamComponent } from '../create-team/create-team.component';
import { TeamSettingsComponent } from '../team-settings/team-settings.component';
import { OonaSocketService } from '../../services/oona-socket.service';
import { BehaviorSubject, Observable } from 'rxjs';

// NgRx
import { Store } from '@ngrx/store';
// import {AllStreamsModel} from '../../models/streams.model';
import { ChannelSettingsComponent } from '../channel-settings/channel-settings.component';
import { SingleMessageModel } from '../../models/message.model';
import { Topics } from '../../models/topics.model';
import { SubStreamsModel } from '../../../models/streams.model';
import {
  getStreams,
  getStreamsLoaded,
  getStreamsLoading,
  privateStreams,
  publicStreams,
} from '../../../state/entities/streams.entity';
import { streamsUnread } from '../../../state/entities/messages/stream.messages.entity';
import {
  privateMessagesLoaded,
  privateUnreadCounter,
  privateUnreadLength,
  unreadMessages,
} from '../../../state/entities/messages/private.messages.entity';
import * as streamActions from '../../../../dashboard/state/actions/streams.actions';
import { take } from 'rxjs/operators';

interface TopicDetails {
  topic_name: string;
  max_id: number;
  count: number;
}

@Component({
  selector: 'app-team-messaging-left-panel',
  templateUrl: './team-messaging-left-panel.component.html',
  styleUrls: ['./team-messaging-left-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamMessagingLeftPanelComponent implements OnInit {
  newTopicsArray: TopicDetails[] = [];
  allTeams: any;
  streamName: any;
  publicTeams: any = [];
  @Output() topicToDisplay = new EventEmitter<any>();
  @Output() rightPanelEvent = new EventEmitter<string>();
  displayCreateTeamComponentRef: MatDialogRef<CreateTeamComponent> | undefined;
  displayTeamSettingsComponentRef:
    | MatDialogRef<TeamSettingsComponent>
    | undefined;
  displayCreatChannelComponentRef:
    | MatDialogRef<ChannelSettingsComponent>
    | undefined;
  allUsers = Array();
  pmNames = Array();
  privateChatMembers = Array();
  loggedInUserProfile: any;
  private privateAndPublicTeams: any;
  private privateAndPublicChannels: any;
  newMessagesCount: number | undefined;
  streamMessages = Array();

  // streams$!: Observable<AllStreamsModel[]>;

  topics!: Observable<any>;
  allTopics: any = [];
  privateTopics: any = [];
  publicTopics: any = [];

  streams: SubStreamsModel[] = [];
  streamsSubject$ = new BehaviorSubject(this.streams);
  streamsObservable = this.streamsSubject$.asObservable();

  streamUnreadCounter: any[] = [];
  finalStream: any[] = [];
  finalStreamSubject = new BehaviorSubject(this.finalStream);
  finalStreamObservable = this.finalStreamSubject.asObservable();

  uniqueId: number[] = [];
  allUnread$: Observable<number> = this.store.select(privateUnreadCounter);
  privateUnread$: Observable<number> = this.store.select(privateUnreadLength);

  // streamTopics: AllStreamsModel[] = [];
  // streamTopicsSubject = new BehaviorSubject<AllStreamsModel[]>(this.streamTopics);
  // streamTopicObservable = this.streamTopicsSubject.asObservable();

  privateUnreadMsgCounter = 0;
  privateUnreadMsgCounterSubject = new BehaviorSubject(
    this.privateUnreadMsgCounter
  );
  privateUnreadMsgCounterObservable =
    this.privateUnreadMsgCounterSubject.asObservable();

  totalUnreadMsg = 0;
  totalUnreadMsgSubject$ = new BehaviorSubject<number>(this.totalUnreadMsg);
  totalUnreadMsgObservable = this.totalUnreadMsgSubject$.asObservable();

  privateUnreadCount = 0;

  publicStreams: SubStreamsModel[] = [];
  publicStreamsSubject = new BehaviorSubject<SubStreamsModel[]>(
    this.publicStreams
  );
  publicStreamsObservable = this.publicStreamsSubject.asObservable();

  privateStreams: SubStreamsModel[] = [];
  privateStreamsSubject = new BehaviorSubject<SubStreamsModel[]>([
    ...new Set(this.privateStreams),
  ]);
  privateStreamsObservable = this.privateStreamsSubject.asObservable();

  subStreams$: Observable<SubStreamsModel[]> = this.store.select(getStreams);
  streams$: Observable<SubStreamsModel[]> = this.store.select(getStreams);
  streamsLoading$: Observable<boolean> = this.store.select(getStreamsLoading);

  // @ts-ignore
  unreadMessages$: Observable<SingleMessageModel[]> =
    this.store.select(unreadMessages);
  messagesLoaded$: Observable<boolean> = this.store.select(
    privateMessagesLoaded
  );
  streamsLoaded$: Observable<boolean> = this.store.select(getStreamsLoaded);

  constructor(
    public messagingService: MessagingService,
    private router: Router,
    private dialog: MatDialog,
    private change: ChangeDetectorRef,
    private userSocketService: OonaSocketService,
    private store: Store
  ) {}

  ngOnInit(): void {
    // fire on page load handler
    // this.streams$ = this.store.select(getAllStreams);
    // this.streamUnread$ = this.store.select(getStreamUnreadMessages);
    // this.privateUnread$ = this.store.select(getPrivateUnreadMessages);

    this.initPageHandler();
    // this.handleStreams();
    // this.readMessageFlags();
    // this.handleStreamCategory();
  }

  loadedComplete(): void {
    this.streamsLoaded$.subscribe({
      next: (streamsLoaded: boolean) => {
        if (streamsLoaded) {
          this.messagesLoaded$.subscribe({
            next: (messagesLoaded: boolean) => {
              if (messagesLoaded) {
                setTimeout(() => {
                  this.streamsCounter();
                }, 100);
              }
            },
          });
        }
      },
    });
  }

  streamsCounter(): void {
    const uniqueId: number[] = [];
    const uniqueStream: number[] = [];
    this.subStreams$.subscribe({
      next: (streams) => {
        streams.map((stream) => {
          stream = {
            ...stream,
            unread: 0,
          };

          this.unreadMessages$.subscribe({
            next: (messages) => {
              messages.map((message) => {
                if (uniqueId.includes(message.id)) {
                  return;
                }
                if (message.stream_id === stream.stream_id) {
                  stream = {
                    ...stream,
                    unread: (stream.unread += 1),
                  };

                  stream.topic?.map((topicItem) => {
                    topicItem = {
                      ...topicItem,
                      unread: 0,
                    };

                    if (
                      topicItem.name.toLowerCase() ===
                      message.subject.toLowerCase()
                    ) {
                      topicItem.unread = topicItem.unread + 1;
                      if (uniqueStream.includes(stream.stream_id)) {
                        return;
                      }

                      stream.history_public_to_subscribers
                        ? this.publicStreamsSubject.subscribe({
                            next: (content) => content.push(stream),
                          })
                        : this.privateStreamsSubject.subscribe({
                            next: (content) => content.push(stream),
                          });
                      uniqueStream.push(stream.stream_id);
                    }
                  });
                }
                this.uniqueId.push(message.id);
              });
            },
          });
        });
      },
    });
  }

  handleStreams(): void {
    // Fetch Topics
    this.subStreams$.subscribe((streams) => {
      const uniqueId: number[] = [];
      const uniqueStream: number[] = [];

      take(streams.length),
        streams.map((stream: SubStreamsModel) => {
          const streamId = stream?.stream_id;

          this.allTopics = [...this.allTopics, stream];

          this.unreadMessages$.subscribe((messages: SingleMessageModel[]) => {
            messages.map((message: SingleMessageModel) => {
              if (message.stream_id !== stream.stream_id) {
                return;
              }
              if (uniqueId.includes(message.id)) {
                return;
              }

              if (message.stream_id === stream.stream_id) {
                // @ts-ignore
                this.streamsSubject$.find((streamItem: SubStreamsModel) => {
                  // tslint:disable-next-line:no-unused-expression
                  if (streamItem.stream_id === stream.stream_id) {
                    streamItem.unread += 1;

                    // @ts-ignore
                    streamItem.topic.map((topicItem: Topics) => {
                      if (
                        topicItem.name.toLowerCase() ===
                        message.subject.toLowerCase()
                      ) {
                        // @ts-ignore
                        topicItem.unread += 1;
                      }
                    });
                  }
                });
                this.allTopics.find((streamItem: SubStreamsModel) => {
                  // tslint:disable-next-line:no-unused-expression
                  if (streamItem.stream_id === stream.stream_id) {
                    streamItem.unread += 1;

                    // @ts-ignore
                    streamItem.topic.map((topicItem: Topics) => {
                      if (
                        topicItem.name.toLowerCase() ===
                        message.subject.toLowerCase()
                      ) {
                        // @ts-ignore
                        topicItem.unread += 1;
                      }
                    });
                  }
                });
              }
              uniqueId.push(message.id);
            });
          });
          this.change.detectChanges();
        });
    });
  }

  initPageHandler(): void {
    this.loadedComplete();
    // this.handleStreams();
    // handle All Unread Messages
    // this.handleUnreadMsgCounter();
    // this.handleNewStream();

    // this.streamTopics();
    // this.handleSocketsNewMessage();

    // get array of unread messsages
    // this.unreadStreams$ = this.store.select(getStreamUnread);

    this.listAllTeams();
    this.userSocketService.streamMessageSocket.subscribe((messages) => {
      this.streamMessages = messages;
      this.updateTeamsWithMessageCount(messages);
    });
    this.messagingService.currentPmNames.subscribe((pmNames) => {
      this.pmNames = this.removeDuplicates(this.createArrayOfPms(pmNames)); // always get the current value
    });

    this.messagingService.currentUserProfile().subscribe((profile: any) => {
      this.loggedInUserProfile = profile;
    });
  }

  // handleNewStream(): void {
  //   const unique: number[] = [];
  //   this.userSocketService.newStreamObservable.subscribe(
  //     (newStreams: any[]) => {
  //       newStreams.map((stream: AllStreamsModel) => {
  //         if (unique.includes(stream.stream_id)) { return; }
  //         if (stream.invite_only) {
  //           this.privateTopics = [...this.privateTopics, stream];
  //         } else {
  //           this.publicTopics = [...this.publicTeams, stream];
  //         }
  //         unique.push(stream.stream_id);
  //       });
  //     }
  //   );
  // }
  //
  // handleCounter(stream?: AllStreamsModel, topic?: Topics): void {
  //   const uniqueId: number[] = [];
  //   // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:max-line-length
  //   const streamItem: AllStreamsModel = this.allTopics.find((streamContent: AllStreamsModel) => streamContent.stream_id === stream?.stream_id);
  //   const topicContent = streamItem.topics.find((topicItem: Topics) => topicItem.name.toLowerCase() === topic?.name.toLowerCase());
  //
  //   if (topic) {
  //     //
  //     this.unreadStreams$.subscribe(
  //       (messages: SingleMessageModel[]) => {
  //         messages.map((message: SingleMessageModel) => {
  //           if (message.subject.toLowerCase() === topic.name.toLowerCase() && streamItem.unread > 0) {
  //
  //             streamItem.topics.map((topicItem: Topics) => {
  //               // @ts-ignore
  //               if (topicItem.name.toLowerCase() === topic.name.toLowerCase() && topicItem?.unread > 0) {
  //                 topicItem.unread ? topicItem.unread -= 1 : topicItem.unread = 0;
  //                 streamItem.unread -= 1;
  //               }
  //             });
  //
  //           }
  //         });
  //       }
  //     );
  //   } else {
  //     // set all topics unread to zero
  //     streamItem.unread = 0;
  //     streamItem.topics.map((topicItem: Topics) => {
  //       topicItem.unread = 0;
  //     });
  //   }
  //   this.allTopics = [...this.allTopics, streamItem];
  //
  // }

  // handleStreamCategory(): void {
  //
  //   this.subStreams$.subscribe({
  //     next: (streams: SubStreamsModel[]) => {
  //       streams.map((item: SubStreamsModel) => {
  //         if (item.invite_only) {
  //           this.privateTopics.push(item);
  //           this.privateTopics = this.privateTopics.filter((v: any, ind: any, s: string | any[]) => {
  //             return s.indexOf(v) === ind;
  //           });
  //           this.privateTopics = this.privateTopics.sort((a: AllStreamsModel, b: AllStreamsModel) => b.unread - a.unread);
  //
  //         } else {
  //           this.publicTopics.push(item);
  //           this.publicTopics = this.publicTopics.filter((v: any, ind: any, s: string | any[]) => {
  //             return s.indexOf(v) === ind;
  //           });
  //           this.publicTopics = this.publicTopics.sort((a: AllStreamsModel, b: AllStreamsModel) => b.unread - a.unread);
  //         }
  //       });
  //     }
  //   });
  //
  //   // this.allTopics.map(
  //   //   (item: AllStreamsModel) => {
  //   //     if (item.invite_only) {
  //   //       this.privateTopics.push(item);
  //   //       this.privateTopics = this.privateTopics.filter((v: any, ind: any, s: string | any[]) => {
  //   //         return s.indexOf(v) === ind;
  //   //       });
  //   //       this.privateTopics = this.privateTopics.sort((a: AllStreamsModel, b: AllStreamsModel) => b.unread - a.unread);
  //   //
  //   //     } else {
  //   //       this.publicTopics.push(item);
  //   //       this.publicTopics = this.publicTopics.filter((v: any, ind: any, s: string | any[]) => {
  //   //         return s.indexOf(v) === ind;
  //   //       });
  //   //       this.publicTopics = this.publicTopics.sort((a: AllStreamsModel, b: AllStreamsModel) => b.unread - a.unread);
  //   //     }
  //   //   }
  //   // );
  // }

  listAllTeams(): any {
    this.messagingService.getAllTeams().subscribe((teams: any) => {
      this.privateAndPublicTeams = teams.streams;
      // display only teams that are private here
      this.allTeams = teams.streams.filter(
        (team: { invite_only: any }) => team.invite_only
      );
      this.publicTeams = teams.streams.filter(
        (team: { invite_only: any }) => !team.invite_only
      );
      // this.streamTopics(teams.streams);
    });
  }

  removeDuplicates(data: any): any {
    // tslint:disable-next-line:max-line-length
    return data.filter(
      (value: { id: any }, index: any, array: { id: any }[]) =>
        array.findIndex((item: { id: any }) => item.id === value.id) === index
    );
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
    dialogConfig.data = { allTeams: this.privateAndPublicTeams };
    this.displayTeamSettingsComponentRef = this.dialog.open(
      TeamSettingsComponent,
      dialogConfig
    );
    this.displayTeamSettingsComponentRef.afterClosed().subscribe((data) => {
      if (data === 'success') {
        this.listAllTeams();
      }
    });
  }

  channelSettings(): void {
    const dialogRef = this.dialog.open(ChannelSettingsComponent, {
      height: '20rem',
      width: '25rem',
      data: {
        name: this.streamName,
      },
    });
  }

  private updateTeamsWithMessageCount(messages: any[]): void {
    if (messages.length > 0) {
      this.allTeams.forEach(
        (team: { messageCount: number; stream_id: any }) => {
          team.messageCount = messages.filter(
            (message) => message.stream_id === team.stream_id
          ).length;
        }
      );

      this.publicTeams.forEach(
        (team: { messageCount: number; stream_id: any }) => {
          team.messageCount = messages.filter(
            (message) => message.stream_id === team.stream_id
          ).length;
        }
      );
    }
  }

  // handleSocketsNewMessage(): void {
  //   this.userSocketService.streamMessageSocket.subscribe(
  //     (messages: SingleMessageModel[]) => {
  //       if (!messages.length) {
  //         return;
  //       }
  //       console.log('Unread messages ==>>', messages);
  //
  //       this.unreadStreams$.subscribe(
  //         (streamMessages: SingleMessageModel[]) => {
  //           streamMessages.map((message: SingleMessageModel) => {
  //             console.log('Stream messages ===>>', message);
  //             streamMessages.push(message);
  //           });
  //         }
  //       );
  //     }
  //   );
  // }

  getStreamName(stream?: any, topic?: any): void {
    // stream
    this.streamName = stream.name;
  }

  // handleUnreadMsgCounter(): void {
  //
  //   this.store.select(getStreamUnreadMessages).subscribe(
  //     unread => this.streamUnreadCount = unread
  //   );
  //
  //   this.store.select(getPrivateUnreadMessages).subscribe(
  //     unread => this.privateUnreadCount = unread
  //   );
  //   this.handleTotalUnread();
  // }

  // handleTotalUnread(): void {
  //
  //   this.streamUnread$.subscribe(
  //     stream => {
  //
  //       this.privateUnread$.subscribe(
  //         privateUnread => {
  //           this.totalUnreadMsgSubject$.next(privateUnread + stream);
  //         }
  //       );
  //
  //     }
  //   );
  // }

  handleShowAllUsers(): void {
    this.rightPanelEvent.emit('all_users');
  }

  // The public messages topic fetcher
  handlePublicNavigateTopic(stream?: any, topic?: any): void {
    this.checkTopicNavigate(stream, topic);
    this.rightPanelEvent.emit('team_users');
  }

  // The private messages topic fetcher
  handlePrivateNavigateTopic(stream?: any, topic?: any): void {
    this.rightPanelEvent.emit('team_users');
    this.checkTopicNavigate(stream, topic);
  }

  // Get messages when user clicks a topic name
  checkTopicNavigate(stream?: any, topic?: any): any {
    let streamName = stream?.name;
    streamName = streamName.replace(/\s+/g, '-').toLowerCase();

    // this.subStreams$.subscribe({
    //   next: (streams) => {
    //     const index = this.allTeams.indexOf(stream);
    //     this.allTeams[index] = stream;
    //     this.change.detectChanges();
    //   }
    // });

    if (topic) {
      this.router.navigate(['dashboard/messaging/team'], {
        queryParams: {
          team: stream.name.replace(/\s/g, ''),
          id: stream.stream_id,
          topic: topic.name.replace(/\s/g, '-'),
        },
      });
    } else {
      this.router.navigate(['dashboard/messaging/team'], {
        queryParams: {
          team: stream.name.replace(/\s/g, ''),
          id: stream.stream_id,
        },
      });
    }
    // this.handleCounter(stream, topic);
  }
}
