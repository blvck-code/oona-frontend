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
import { getAllStreams, getTopics} from '../../state/messaging.selectors';
import {AllStreamsModel} from '../../models/streams.model';
import {take} from 'rxjs/operators';
import {ChannelSettingsComponent} from '../channel-settings/channel-settings.component';
import {SingleMessageModel} from '../../models/messages.model';
import {getAllUsers} from '../../../../auth/state/auth.selectors';
import {Title} from '@angular/platform-browser';
import {numbers} from "@material/dialog/constants";
import {log} from "util";

interface streamArray {
  stream_id: number,
  stream_name: string,
  count: number,
  topics: topicDetails[]
  // topics: []
}

interface topicDetails {
  topic_name: string,
  max_id: number,
  count: number
}


@Component({
  selector: 'app-team-messaging-left-panel',
  templateUrl: './team-messaging-left-panel.component.html',
  styleUrls: ['./team-messaging-left-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TeamMessagingLeftPanelComponent implements OnInit {
  newTopicsArray: topicDetails[] = [];

  allTeams: any;
  streamName: any;
  publicTeams: any;
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

  listedStreamArray: any = [];

  streamArray:streamArray[] = [];
  streamIds: number[] = [];

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
    private titleService: Title,
  ) {
  }

  ngOnInit(): void {
    // fire on page load handler
    this.initPageHandler();
  }

  initPageHandler(): void {
    // handle All Unread Messages
    this.handleUnreadMessage();

    // this.streamTopics();
    this.handleSocketsNewMessage();

    // show tab message
    this.showNotificationCounter();

    // Fetch streams
    this.streams = this.store.select(getAllStreams);

    // Fetch Topics
    this.streams.subscribe(streams => {


      take(streams.length),
        streams.map((stream: AllStreamsModel) => {
          // let streamDetail: streamArray = <streamArray>{};
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

                  const streamContent = {
                    stream_id: stream.stream_id,
                    name: stream.name,
                    topics: {
                      topics: stream.topics?.zulip.topics,
                    },
                    counter: 0
                  }

                  this.streamUnreadCounter.push(streamContent);

                  if (this.streamIds.includes(stream.stream_id)) {
                    return;
                  } else {
                    this.listedStreamArray.push(stream);
                    this.streamIds.push(stream.stream_id);
                  }

                  this.change.detectChanges();
                }
              }
            );

          // this.streamArray.push(streamDetail);
        });
      setTimeout(() => {
        this.handleUnreadMsgCounter();
      }, 1000)
    });

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

  handleNavigateTopic(stream?: any, topic?: any): void {
    // stream


    let streamName = stream?.name;
    streamName = streamName.replace(/\s+/g, '-').toLowerCase();

    // // @Todo change to topic incase user clicks topic instead of stream
    if (topic) {
      // topic
      let topicName = topic?.name;
      topicName = topicName.replace(/\s+/g, '-').toLowerCase();

      this.router.navigate([`/dashboard/messaging/streams/${stream.stream_id}-${streamName}/topic/${topicName}`]);
    } else {
      this.router.navigate([`/dashboard/messaging/streams/${stream.stream_id}-${streamName}`]);
    }
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
    )
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

    this.streamUnreadCounter.map((counter: { stream_id: number, counter: number, name: string, topics: { topics: any[] }}) => {


      let unreadContent = {
        name: counter.name,
        stream_id: counter.stream_id,
        unreadCount: 0,
        topics: counter.topics
      };


      this.messagingService.streamsUnreadMsgArrayObservable.subscribe((unreadStreams: SingleMessageModel[]) => {
        unreadStreams.map((unreadStream: SingleMessageModel) => {


          take(1)
          if(+unreadStream.stream_id === +counter.stream_id) {
            // adding counter for all unread messages of the stream
            unreadContent.unreadCount += 1;

            if(topicSubjects.includes(unreadStream.subject.toLowerCase())){
              return
            } else {
              topicSubjects.push(unreadStream.subject.toLowerCase());

              counter.topics.topics.map((topic: any) => {
                topic.unread = 0;

                topicSubjects.map((topicName: string) => {
                  // console.log('Topic ===>>>', topicSubjects)

                  if(topic.name.toLowerCase() === topicName.toLowerCase()){
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

    // this.finalStreamObservable.subscribe(
    //   content => console.log('Content ==>', content)
    // )

    // this.messagingService.streamsUnreadMsgArrayObservable.subscribe(
    //   unreads => unreads?.map((message: SingleMessageModel) => {
    //
    //     this.streamUnreadCounter.map(
    //       unread => {
    //         // if(unread.stream_id === message.stream_id) {
    //         //   unread.counter += 1;
    //         // } else {
    //         //   unread.counter = 1
    //         // }
    //
    //         console.log(unread)
    //       }
    //     )
    //
    //   })
    // );
    setTimeout(() => {
      this.unreadMessageFilter();
    }, 1000)
  }

  unreadMessageFilter(): any {

    this.streamUnreadCounter.map(
      (message: any) => {
        // console.log(message)

        this.allTopics.map((streamContent: AllStreamsModel) => {

          if (streamContent.stream_id === message.stream_id){
            // console.log(message)
          }

        })

      }
    )
  }

  showNotificationCounter(): void {
    this.totalUnreadMsgObservable.subscribe(
      total => {
        if (total > 0) {
          this.titleService.setTitle(`(${total}) - AVL - Oona`);
        } else {
          this.titleService.setTitle(`AVL - Oona`);
        }
      }
    );
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

  // showAllGroupPms(): void {
  //   this.router.navigate(['dashboard/messaging/group-pm']);
  // }
  //
  // showAllMessages(): void {
  //   this.router.navigate(['/dashboard/messaging/all_messages']);
  // }
  //
  // showAllPrivateMessages(): void {
  //   this.router.navigate(['dashboard/messaging/private']);
  // }
  //
  // allUsersRegistered(): void {
  //   this.messagingService.getUsersByAvailability().subscribe((users: { members: any[]; }) => {
  //     const usersPresent = users.members.filter(user => user.presence);
  //     this.allUsers = this.messagingService.newListOfUsers(usersPresent);
  //   });
  // }
  //
  // goToMemberChat(member: any): void {
  //   this.router.navigate(['dashboard/messaging/narrow'], {queryParams: {member: member.full_name.replace(/\s/g, '')}});
  // }
  //
  // showAllMentionedMessages(): void {
  //   this.router.navigate(['dashboard/messaging/mentions']);
  // }
  //
  // displayMessagesOfStream(): void {
  //   this.messagingService.changeTeamTopicMessages('');
  // }
  //
  // streamTopics(teams: { stream_id: any; }[]): void {
  //   const allAvailableTeams = Array();
  //   // console.log('teams', teams);
  //   // get topic for each team
  //   teams.forEach((team: { stream_id: any; }) => {
  //     this.messagingService.getTopicsOnStreams(team.stream_id).subscribe((topicResults: { zulip: { topics: any; }; }) => {
  //       const allTopics = topicResults.zulip.topics;
  //       const teamTopic = {topics: allTopics};
  //       team = {...team, ...teamTopic};
  //       // allAvailableTeams.push(team);
  //     });
  //     allAvailableTeams.push(team);
  //   });
  //
  //   this.allTeams = allAvailableTeams.filter((team: { invite_only: any; }) => team.invite_only);
  //   this.publicTeams = allAvailableTeams.filter((team: { invite_only: any; }) => !team.invite_only);
  // }
  //
  // displayMessagesOfTopic(topic: any): void {
  //   if (topic.name){
  //     this.messagingService.changeTeamTopicMessages(topic.name);
  //   }else{
  //     this.messagingService.changeTeamTopicMessages('');
  //   }
  // }
  //
  // getStreamDetails(team: any): void {
  //   // find the index of this team within all the teams
  //   const index = this.allTeams.indexOf(team);
  //
  //   this.messagingService.getTopicsOnStreams(team.stream_id).subscribe((topicResults: { zulip: { topics: any; }; }) => {
  //     team.topics = topicResults.zulip.topics;
  //   });
  //
  //   this.allTeams[index] = team;
  //   this.userSocketService.newMessageCount -= team.messageCount;
  //   this.userSocketService.changeNewMessageCount(this.userSocketService.newMessageCount);
  //   team.messageCount = 0;
  //   this.change.detectChanges();
  //   this.router.navigate(['dashboard/messaging/team'], {
  //     queryParams: {
  //       team: team.name.replace(/\s/g, ''),
  //       id: team.stream_id
  //     }
  //   });
  // }
}
