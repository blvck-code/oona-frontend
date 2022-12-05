import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {MessagingService} from '../../services/messaging.service';
import {FormBuilder, Validators} from '@angular/forms';
import {NotificationService} from '../../../../shared/services/notification.service';
import {CreateTeamComponent} from '../create-team/create-team.component';
import {LeaveTeamComponent} from './leave-team/leave-team.component';
import {ZulipSingleUser} from '../../../../auth/models/user.model';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import {getUserId, getZulipUsers} from '../../../../auth/state/auth.selectors';
import {AllStreamsModel, SubStreamsModel} from '../../../models/streams.model';
import {DashService} from '../../../service/dash-service.service';
import {getStreams} from '../../../state/entities/streams.entity';
import {EditStreamComponent} from './edit-stream/edit-stream.component';

@Component({
  selector: 'app-team-settings',
  templateUrl: './team-settings.component.html',
  styleUrls: ['./team-settings.component.scss']
})
export class TeamSettingsComponent implements OnInit {
  teams: any;
  allUsers: ZulipSingleUser[] = Array();
  allUsers$!: Observable<ZulipSingleUser[]>;
  currentUserId$!: Observable<any>;

  // Streams
  allStreams: AllStreamsModel[] = [];
  subscribedStreams$: Observable<SubStreamsModel[]> = this.store.select(getStreams);

  teamOfChoice: any;
  displayCreateTeamComponentRef: MatDialogRef<CreateTeamComponent> | undefined;
  displayLeaveTeamComponentRef: MatDialogRef<LeaveTeamComponent> | undefined;
  displayEditStreamComponentRef: MatDialogRef<EditStreamComponent> | undefined;
  filteredTeams = Array();
  filteredUsers = Array();
  searchResult =  Array();
  allSubscribers: any;
  groupMemberDetails = Array();
  filteredGroupMembers = Array();
  selectedUser = {
    full_name: '',
    email: ''
  };

  constructor(
    private dialogRef: MatDialogRef<TeamSettingsComponent>,
    public messagingService: MessagingService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private  notificationService: NotificationService,
    private change: ChangeDetectorRef,
    private store: Store<AppState>,
    private dashSrv: DashService,
    // @ts-ignore
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.teams = data.allTeams;
    this.filteredTeams = data.allTeams;
    this.getAllSubscribers();
  }

  streamForm = this.formBuilder.group({
    teamName: ['', Validators.required],
    teamDescription: ['', Validators.required],
    teamMembers: [''],
    authErr: [true],
    teamInvite: [false],
    announce: [false],
    teamHistory: [false],
    public: [false],
    privateShare: [false],
    privateShareNo: [false],
  });

  emptyForm = false;

  // privateShareF = '';
  ngOnInit(): void {
    this.onInitHandler();
  }

  onInitHandler(): void {
    this.messagingService.getUsersByAvailability().subscribe((users: { members: any[]; }) => {

      this.allUsers = users.members.filter(user => user.presence);
      this.filteredUsers = users.members.filter(user => user.presence);
    });

    this.allUsers$ = this.store.select(getZulipUsers);
    this.currentUserId$ = this.store.select(getUserId);
    this.getAllStreams();
  }

  getAllSubscribers(): void{
    this.messagingService.getAllSubscribedStreams().subscribe(
      ( subscribers: { subscriptions: any; name: any; }) => {
        this.allSubscribers = subscribers.subscriptions;
      });
  }

  getSubscribersOfTeam(streamId: any): void{
    // re-initialize these arrays as empty each time this method is called.
    this.groupMemberDetails = [];
    if (this.allSubscribers && streamId ){
      this.getDetails(streamId);

    }
  }
  getDetails(streamId: string): void {
    const allEmailsSubscribed = this.allSubscribers.find((teams: { stream_id: any; }) => teams.stream_id === Number(streamId)).subscribers;
    const streamName = this.allSubscribers.find((teams: { stream_id: any; }) => teams.stream_id === Number(streamId)).name;
    this.messagingService.changeStreamName(streamName);
    // * filter out from all users, details of those whose emails have been subscribed
    // @ts-ignore
    this.allUsers.forEach((user) => {
      // @ts-ignore
      if (allEmailsSubscribed.includes(user.email)){
        this.groupMemberDetails.push(user);
        this.filteredGroupMembers = this.groupMemberDetails;
      }
    });
    this.change.detectChanges();
  }

  closeTeamSettings(): void {
    this.dialogRef.close();
  }

  selectTeam(team: any): void {
    this.teamOfChoice = team;
    this.getSubscribersOfTeam(team.stream_id);
  }
  listAllTeams(): any{
    this.messagingService.getAllTeams().subscribe((teams: any) => {
      this.teams = teams.streams;
    });
  }

  createTeam(): void {
    this.teamOfChoice = false;
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.height = '60vh';
    // dialogConfig.width = '50vw';
    // this.displayCreateTeamComponentRef = this.dialog.open(CreateTeamComponent, dialogConfig);
    // this.displayCreateTeamComponentRef.afterClosed().subscribe(
    //   data => {
    //     if (data === 'success'){
    //       this.listAllTeams();
    //     }
    //   }
    // );
  }

  getAllStreams(): void {
    this.dashSrv.getAllStreams().subscribe({
      next: (streams) => {
        this.allStreams = streams.streams;
      }
      }
    );
  }

  getSubStreams(): void {
    this.subscribedStreams$.subscribe({
      next: (streams) => {
        this.filteredTeams = streams;
      }
    });
  }

  searchTeam(event: any): any {
    // tslint:disable-next-line:max-line-length
    this.filteredTeams  = this.teams.filter((team: { name: string; }) => team.name.toLowerCase().includes(event.target.value.toLowerCase()));
  }
  showSubscribedTeams(): void{
    this.filteredTeams = this.teams.filter((team: { invite_only: any; }) => team.invite_only);
  }
  showAllAvailableTeams(): void{
    this.filteredTeams = this.allStreams;
  }

  searchSubscriber(event: any): void {
    // tslint:disable-next-line:max-line-length
    this.filteredGroupMembers = this.groupMemberDetails.filter(user => user.full_name.toLowerCase().includes(event.target.value.toLowerCase()) || user.email.toLowerCase().includes(event.target.value.toLowerCase()));
  }

  unsubscribeFromTeam(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '20vh';
    dialogConfig.width = '20vw';
    dialogConfig.data = {teamToLeave: this.teamOfChoice};
    this.displayLeaveTeamComponentRef = this.dialog.open(LeaveTeamComponent, dialogConfig);
    this.displayLeaveTeamComponentRef.afterClosed().subscribe(
      data => {
        if (data === 'success'){
          this.listAllTeams();
          this.filteredTeams = this.teams;
        }
      }
    );
  }

  editStream(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '35vh';
    dialogConfig.width = '40vw';
    dialogConfig.data = {teamToLeave: this.teamOfChoice};
    this.displayEditStreamComponentRef = this.dialog.open(EditStreamComponent, dialogConfig);
    this.displayEditStreamComponentRef.afterClosed().subscribe(
      data => {
        if (data === 'success'){
          this.listAllTeams();
          this.filteredTeams = this.teams;
        }
      }
    );
  }

  searchUser(event: any): any {
    if (event.target.value === '') {
      return this.searchResult = [];
    }
    // tslint:disable-next-line:max-line-length
    this.searchResult = this.allUsers.filter(user => user.full_name.toLowerCase().includes(event.target.value.toLowerCase()) || user.email.toLowerCase().includes(event.target.value.toLowerCase()));
  }

  addMemberToTeam(member: any): void {
    this.selectedUser = member;
  }

  subscribeNewMember(): void {
    const selectedUser = {
      full_name: '',
      email: ''
    };

    if (this.selectedUser === selectedUser){
      return;
    }

    const streamData =
    {
      name: this.teamOfChoice.name,
      description: this.teamOfChoice.description,
      user_id: [this.selectedUser.email]

    };
    this.messagingService.subscribeMember(streamData).subscribe((response: any) => {
      if (response['zulip message'].result === 'success'){
        this.notificationService.showSuccess(`${this.selectedUser.full_name} subscribed`, 'Successfully subscribed');
        this.getSubscribersOfTeam(this.teamOfChoice.stream_id);
        this.change.detectChanges();
      }else{
        this.notificationService.showError(`Cannot add ${this.selectedUser.full_name} at this time`, 'Could not add member');
      }
    });
  }
}
