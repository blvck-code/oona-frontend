import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {MessagingService} from '../../services/messaging.service';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {CreateTeamComponent} from '../create-team/create-team.component';
import {TeamSettingsComponent} from '../team-settings/team-settings.component';
import {OonaSocketService} from '../../services/oona-socket.service';
import {Observable, Subscription} from 'rxjs';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import {getAllStreams, getStreamsLoading, getTopics} from '../../state/messaging.selectors';
import {AllStreamsModel, SubscribedStreams} from '../../models/streams.model';
import * as messagingActions from '../../state/messaging.actions';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-team-messaging-left-panel',
  templateUrl: './team-messaging-left-panel.component.html',
  styleUrls: ['./team-messaging-left-panel.component.scss']
})
export class TeamMessagingLeftPanelComponent implements OnInit {

  allTeams: any;
  publicTeams: any;
  private allAvailableTeams: any;
  @Output() topicToDisplay = new EventEmitter<any>();
  displayCreateTeamComponentRef: MatDialogRef<CreateTeamComponent> | undefined;
  displayTeamSettingsComponentRef: MatDialogRef<TeamSettingsComponent> | undefined;
  allUsers = Array();
  pmNames = Array();
  privateChatMembers = Array();
  loggedInUserProfile: any;
  private privateAndPublicTeams: any;
  newMessagesCount: number | undefined;
  streamMessages = Array();
  streams!: Observable<AllStreamsModel[]>;
  topics!: Observable<any>;
  streamIds!: any[];
  allTopics: any = [];

  constructor(
    public messagingService: MessagingService,
    private router: Router,
    private dialog: MatDialog,
    private change: ChangeDetectorRef,
    private userSocketService: OonaSocketService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    // Get All Streams
    this.initPage();

    console.log('All topics ===>>', this.allTopics);


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

    this.messagingService.currentUserProfile().subscribe( (profile: any) => {
      this.loggedInUserProfile = profile;
    });
  }

  initPage(): void {
    // Fetch streams
    this.store.select(getAllStreams);
    // this.store.select(getAllStreams).subscribe(
    //   data => console.log('all streams  ====>>>', data)
    // );
    // Fetch Topics
    this.store.select(getStreamsLoading).subscribe(
      resp => {
        if (!resp){
          this.streams = this.store.select(getAllStreams);
          this.store.select(getAllStreams).subscribe(
            streams => {
              take(streams.length),
                streams.map((stream: AllStreamsModel) => {
                  const streamId = stream?.stream_id;
                  // console.log('Stream content ===>>', stream);
                  take(1),
                    this.messagingService.getTopicsOnStreams(stream.stream_id).subscribe(
                      // tslint:disable-next-line:no-shadowed-variable
                      (data: any) => {
                        const topicId = data?.oz?.stream_id;
                        if (topicId === streamId) {
                          stream = {
                            ...stream,
                            topics: data
                          };
                          this.allTopics = [...this.allTopics, stream];
                        }
                      }
                    );
                  // this.store.dispatch(new messagingActions.LoadStreamTopic(item.stream_id));
                  // this.streamIds = [...this.streamMessages, item.stream_id];
                });
            }
          );
        }
      }
    );
    // Get Topics from store
    this.topics = this.store.select(getTopics);

  }

  getTopics(team: any): any {
    // this.store.dispatch(new messagingActions.LoadStreamTopic(team.stream_id));

    this.store.dispatch(new messagingActions.FilterMessages(team));

  }

  displayMessagesOfTopic(team: any, topic?: any): void {
    // if (topic.name){
    //   this.messagingService.changeTeamTopicMessages(topic.name);
    // }else{
    //   this.messagingService.changeTeamTopicMessages('');
    // }
    const streamId = team.stream_id;
    const topicName = topic?.name;

    const filterData = {
      stream_id: streamId,
      topic: topicName
    };
    console.log('Clicked stream ===>>', filterData);
    this.store.dispatch(new messagingActions.FilterMessages(filterData));
  }

  listAllTeams(): any{
    this.messagingService.getAllTeams().subscribe((teams: any) => {
      this.privateAndPublicTeams = teams.streams;
      // display only teams that are private here
      this.allTeams = teams.streams.filter((team: { invite_only: any; }) => team.invite_only);
      this.publicTeams = teams.streams.filter((team: { invite_only: any; }) => !team.invite_only);
      // this.streamTopics(teams.streams);
    });
  }
  removeDuplicates(data: any): any{
    // tslint:disable-next-line:max-line-length
    return data.filter((value: { id: any; }, index: any, array: { id: any; }[]) => array.findIndex((item: { id: any; }) => (item.id === value.id)) === index);
  }
  createArrayOfPms(pmNamesArray: any[]): any{
    pmNamesArray.forEach((chatGroup: any) => {
      this.privateChatMembers.push(...chatGroup);
    });
    return this.privateChatMembers;
  }

  getStreamDetails(team: any): void{
    // find the index of this team within all the teams
    const index = this.allTeams.indexOf(team);

    this.messagingService.getTopicsOnStreams(team.stream_id).subscribe( (topicResults: { zulip: { topics: any; }; }) => {
      team.topics = topicResults.zulip.topics;
    });

    this.allTeams[index] = team;
    this.userSocketService.newMessageCount -= team.messageCount;
    this.userSocketService.changeNewMessageCount(this.userSocketService.newMessageCount);
    team.messageCount = 0;
    this.change.detectChanges();
    this.router.navigate(['dashboard/messaging/team'], { queryParams: { team: team.name.replace(/\s/g, ''), id: team.stream_id } });
  }

  getPublicStreamDetails(team: any): void{
    // find the index of this team within all the teams
    const index = this.publicTeams.indexOf(team);

    this.messagingService.getTopicsOnStreams(team.stream_id).subscribe( (topicResults: { zulip: { topics: any; }; }) => {
      team.topics = topicResults.zulip.topics;
    });

    this.publicTeams[index] = team;
    this.change.detectChanges();
    this.router.navigate(['dashboard/messaging/team'], { queryParams: { team: team.name.replace(/\s/g, ''), id: team.stream_id } });
  }

  streamTopics(teams: { stream_id: any; }[]): void{
    const allAvailableTeams =  Array();
    // console.log('teams', teams);
    // get topic for each team
    teams.forEach((team: { stream_id: any; }) => {
      this.messagingService.getTopicsOnStreams(team.stream_id).subscribe( (topicResults: { zulip: { topics: any; }; }) => {
        const allTopics = topicResults.zulip.topics;
        const teamTopic = { topics: allTopics};
        team = { ...team , ...teamTopic};
        // allAvailableTeams.push(team);
      });
      allAvailableTeams.push(team);
    });

    this.allTeams = allAvailableTeams.filter((team: { invite_only: any; }) => team.invite_only);
    this.publicTeams = allAvailableTeams.filter((team: { invite_only: any; }) => !team.invite_only);
  }

  showAllMessages(): void {
    this.router.navigate(['/dashboard/messaging/all_messages']);
  }

  showAllPrivateMessages(): void {
    this.router.navigate(['dashboard/messaging/private']);
  }
  allUsersRegistered(): void {
    this.messagingService.getUsersByAvailability().subscribe((users: { members: any[]; }) => {
      const usersPresent = users.members.filter(user => user.presence );
      this.allUsers = this.messagingService.newListOfUsers(usersPresent);
    });
  }
  goToMemberChat(member: any): void{
    this.router.navigate(['dashboard/messaging/narrow'], { queryParams: { member: member.full_name.replace(/\s/g, '') } });
  }

  showAllMentionedMessages(): void {
    this.router.navigate(['dashboard/messaging/mentions']);
  }

  displayMessagesOfStream(): void {
    this.messagingService.changeTeamTopicMessages('');
  }

  teamSettings(): void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '80vh';
    dialogConfig.width = '70vw';
    dialogConfig.data = {allTeams: this.privateAndPublicTeams};
    this.displayTeamSettingsComponentRef = this.dialog.open(TeamSettingsComponent, dialogConfig);
    this.displayTeamSettingsComponentRef.afterClosed().subscribe(
      data => {
        if (data === 'success'){
          this.listAllTeams();
        }
      }
    );
  }

  showAllGroupPms(): void {
    this.router.navigate(['dashboard/messaging/group-pm']);
  }

  private updateTeamsWithMessageCount(messages: any[]): void {
    if (messages.length > 0){
    this.allTeams.forEach((team: { messageCount: number; stream_id: any; }) => {
      team.messageCount = messages.filter(message => message.stream_id === team.stream_id).length;
    });

    // this.publicTeams.forEach((team: { messageCount: number; stream_id: any; }) => {
    //   console.log('publicTeams ====>>>', team);
    //     team.messageCount = messages.filter(message => message.stream_id === team.stream_id).length;
    //   });
    }
  }
}
