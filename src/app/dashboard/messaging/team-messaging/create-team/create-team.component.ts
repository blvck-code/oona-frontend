import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MessagingService} from '../../services/messaging.service';
import {FormBuilder, Validators} from '@angular/forms';
import {NotificationService} from '../../../../shared/services/notification.service';
import {HomeService} from '../../../home/shared/home.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import {getZulipProfile, getZulipUsers} from '../../../../auth/state/auth.selectors';
import {ZulipSingleUser} from '../../../../auth/models/user.model';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
export class CreateTeamComponent implements OnInit {

  teamForm = this.formBuilder.group({
    teamName: ['', Validators.required],
    teamDescription: ['', Validators.required],
    teamMembers: [''],
    authErr: [true],
    teamInvite: [false],
    announce: [false],
    teamHistory: [false],
    privateShare: [false],
    privateShareNo: [false],
    public: [false],
    });
  emptyForm = false;
  announceF = '';
  privateTeamInviteShare = '';
  privateTeamInviteNo = '';
  publicF = '';
  selectedUserEmail = [];

  private loggedUserProfile: any;

  attendeeListOpen = false;
  searchText = '';
  oonaUsers: ZulipSingleUser[] = [];
  displayInvitedUsers: ZulipSingleUser[] = [];
  invitedUsers: number[] = [];
  hostError = false;
  loggedInUserId: number[] = [];

  constructor(
    private dialogRef: MatDialogRef<CreateTeamComponent>,
    public messagingService: MessagingService,
    private formBuilder: FormBuilder,
    private  notificationService: NotificationService,
    private homeService: HomeService,
    private store: Store<AppState>,
  ) { }

  getUserInfo(): void {
    this.store.select(getZulipProfile).subscribe(
      ((user: any) => this.loggedInUserId = user?.zulip.id )
    );
  }

  ngOnInit(): void {
    this.getUserInfo();

    this.messagingService.currentUserProfile().subscribe((loggedUser: any) => {
      this.loggedUserProfile = loggedUser.zulip;
    });

    this.getUsers();
  }

  cancelTeamCreate(): void {
    this.dialogRef.close();
  }

  submitForm(): any {
    // console.log('public, prish, prino', this.publicF, this.privateTeamInviteShare,  this.privateTeamInviteNo );
    if ( this.publicF !== '' ){
      this.teamForm.controls.announce.setValue(false);
      this.teamForm.controls.teamHistory.setValue(true);
      this.teamForm.controls.teamInvite.setValue(false);

    }

    if ( this.privateTeamInviteShare  !== '' ){
      this.teamForm.controls.announce.setValue(false);
      this.teamForm.controls.teamHistory.setValue(true);
      this.teamForm.controls.teamInvite.setValue(true);

    }

    if ( this.privateTeamInviteNo  !== '' ){
      this.teamForm.controls.announce.setValue(false);
      this.teamForm.controls.teamHistory.setValue(false);
      this.teamForm.controls.teamInvite.setValue(true);
    }


    const teamData = {
      name: this.teamForm.value.teamName,
      description: this.teamForm.value.teamDescription,
      user_id: [this.loggedUserProfile.email, ...this.selectedUserEmail],
      authorization_errors_fatal: this.teamForm.value.authErr,

      invite_only: this.teamForm.value.teamInvite,
      announce: this.teamForm.value.announce,
      history_public_to_subscribers: this.teamForm.value.teamHistory,


      // Todo add more members here. Automatically add current logged in user
      // user_id: [this.loggedUserProfile.email]
    };

    this.messagingService.createTeam(teamData).subscribe((response: any) => {
      console.log('the team data=====', teamData);
      if (response['zulip message'].result === 'success'){
          this.dialogRef.close('success');
          this.notificationService.showSuccess(`Team ${teamData.name} created`, 'Team created');
          }else{
            this.notificationService.showError(`Unable to create ${teamData.name} at this time`, 'Team not created');
          }

    });
  }

  isSubmitted(): any {
    if (!this.teamForm.valid) {
      this.emptyForm = true;
    }else {
      this.submitForm();

    }
  }

  get teamFormControls(): any {
    return this.teamForm.controls;
  }

  getUsers(): any {
    this.store.select(getZulipUsers).subscribe(
      (users: any) => {
        console.log(this.loggedInUserId);
        const results = users.members;
        // Remove logged in user
        for (let i = 0; i < results.length; i++) {
          if ( results[i].user_id === this.loggedInUserId ){
            results.splice(i, 1);
          }
        }
        this.oonaUsers = results;
      }
    );
  }

  openAttendeesList(): any {
    this.attendeeListOpen = !this.attendeeListOpen;
  }

  selectedUser(user: ZulipSingleUser): any {
    // @ts-ignore
    this.selectedUserEmail.push(user.email);
    console.log('Selected users', this.selectedUserEmail);

    this.displayInvitedUsers.push(user);
    this.invitedUsers.push(user.user_id);
  }

  onRemoveUser(user: ZulipSingleUser): any {
    const userDisplayIndex = this.displayInvitedUsers.indexOf(user);
    const userAddIndex =  this.invitedUsers.indexOf(user.user_id);
    this.displayInvitedUsers.splice(userDisplayIndex, 1);
    this.invitedUsers.splice(userAddIndex, 1);

  }

}
