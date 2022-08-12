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

@Component({
  selector: 'app-team-messaging-left-panel',
  templateUrl: './team-messaging-left-panel.component.html',
  styleUrls: ['./team-messaging-left-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamMessagingLeftPanelComponent implements OnInit {

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
  streamIds!: any[];
  allTopics: any = [];

  unreads = 0;
  unreadsSubject$ = new BehaviorSubject<number>(this.unreads);
  unreadsObservable = this.unreadsSubject$.asObservable();


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
    // Get All Streams
    this.initPage();

    this.userSocketService.allMsgCounterSubject.subscribe(
      msgNumber => console.log('All messages number ==>>', msgNumber)
    );

    this.userSocketService.privateMsgCounterSubject.subscribe(
      msgNumber => console.log('Private messages number ==>>', msgNumber)
    );

    this.userSocketService.messageCount.subscribe(messages => {
      this.newMessagesCount = messages;
    });

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
  }

  handleSoocketsMessages(): void {
    this.userSocketService.streamMessageCountSocket.subscribe(
      message => console.log('New socket message here ===>>>', message)
    )
  }

  getPrivateUnreadMsgs(): void {
    this.userSocketService.messageCountSocket.subscribe(
      newMessage => {
        this.unreads = newMessage;
        console.log('New messages ===>>>', newMessage);
      }
    );
  }

  initPage(): void {
    // this.streamTopics();
    this.getPrivateUnreadMsgs();

    // init sockets
    this.handleSoocketsMessages();
    // Fetch streams
    this.streams = this.store.select(getAllStreams);

    // Fetch Topics
    this.streams.subscribe(streams => {

      take(streams.length),
        streams.map((stream: any) => {
          const streamId = stream?.stream_id;

          take(1),
            this.messagingService.getTopicsOnStreams(stream.stream_id).subscribe(
              (topicData: any) => {
                const topicId = topicData?.oz?.stream_id;

                if (topicId === streamId) {
                  stream = {
                    ...stream,
                    topics: topicData,
                  };
                  this.allTopics = [...this.allTopics, stream];
                  this.change.detectChanges();
                }
              }
            );
        });
    });

    // Get Topics from store
    this.topics = this.store.select(getTopics);
  }

  handleStreamSocket(team: any): any {
    // this.userSocketService.
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

  getStreamDetails(team: any): void {
    // find the index of this team within all the teams
    const index = this.allTeams.indexOf(team);

    this.messagingService.getTopicsOnStreams(team.stream_id).subscribe((topicResults: { zulip: { topics: any; }; }) => {
      team.topics = topicResults.zulip.topics;
    });

    this.allTeams[index] = team;
    this.userSocketService.newMessageCount -= team.messageCount;
    this.userSocketService.changeNewMessageCount(this.userSocketService.newMessageCount);
    team.messageCount = 0;
    this.change.detectChanges();
    this.router.navigate(['dashboard/messaging/team'], {
      queryParams: {
        team: team.name.replace(/\s/g, ''),
        id: team.stream_id
      }
    });
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

  streamTopics(teams: { stream_id: any; }[]): void {
    const allAvailableTeams = Array();
    // console.log('teams', teams);
    // get topic for each team
    teams.forEach((team: { stream_id: any; }) => {
      this.messagingService.getTopicsOnStreams(team.stream_id).subscribe((topicResults: { zulip: { topics: any; }; }) => {
        const allTopics = topicResults.zulip.topics;
        const teamTopic = {topics: allTopics};
        team = {...team, ...teamTopic};
        // allAvailableTeams.push(team);
      });
      allAvailableTeams.push(team);
    });

    this.allTeams = allAvailableTeams.filter((team: { invite_only: any; }) => team.invite_only);
    this.publicTeams = allAvailableTeams.filter((team: { invite_only: any; }) => !team.invite_only);
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

  showAllMessages(): void {
    this.router.navigate(['/dashboard/messaging/all_messages']);
  }

  showAllPrivateMessages(): void {
    this.router.navigate(['dashboard/messaging/private']);
  }

  allUsersRegistered(): void {
    this.messagingService.getUsersByAvailability().subscribe((users: { members: any[]; }) => {
      const usersPresent = users.members.filter(user => user.presence);
      this.allUsers = this.messagingService.newListOfUsers(usersPresent);
    });
  }

  goToMemberChat(member: any): void {
    this.router.navigate(['dashboard/messaging/narrow'], {queryParams: {member: member.full_name.replace(/\s/g, '')}});
  }

  showAllMentionedMessages(): void {
    this.router.navigate(['dashboard/messaging/mentions']);
  }

  displayMessagesOfStream(): void {
    this.messagingService.changeTeamTopicMessages('');
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

  showAllGroupPms(): void {
    this.router.navigate(['dashboard/messaging/group-pm']);
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

  getStreamName(stream?: any, topic?: any): void {
    // stream
    this.streamName = stream.name;
  }
}
