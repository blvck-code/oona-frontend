import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ZulipSingleUser} from '../../../../../auth/models/user.model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-new-team',
  templateUrl: './new-team.component.html',
  styleUrls: ['./new-team.component.scss']
})
export class NewTeamComponent implements OnInit {
  publicF = '';
  announceF = '';
  privateTeamInviteShare = '';
  privateTeamInviteNo = '';
  privateShareF = '';
  whoCanPost = '';

  searchText = '';
  filterWord = '';

  @Input() users$!: Observable<ZulipSingleUser[]>;
  @Input() userId$!: Observable<number>;

  selectedUserEmail = [];
  selectedSubscribers: any[] = [];
  oneByOneUser: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
  ) { }

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

  ngOnInit(): void {
  }

  valideChecks(): void {
    if ( this.publicF !== '' ){
      this.streamForm.controls.announce.setValue(false);
      this.streamForm.controls.teamHistory.setValue(true);
      this.streamForm.controls.teamInvite.setValue(false);

    }

    if ( this.privateShareF  !== '' ){
      this.streamForm.controls.announce.setValue(false);
      this.streamForm.controls.teamHistory.setValue(true);
      this.streamForm.controls.teamInvite.setValue(true);

    }

    if ( this.privateShareF !== '' ){
      this.streamForm.controls.announce.setValue(false);
      this.streamForm.controls.teamHistory.setValue(false);
      this.streamForm.controls.teamInvite.setValue(true);
    }

    const teamData = {
      name: this.streamForm.value.teamName,
      description: this.streamForm.value.teamDescription,
      // user_id: [...this.selectedUserEmail],
      authorization_errors_fatal: this.streamForm.value.authErr,

      invite_only: this.streamForm.value.teamInvite,
      announce: this.streamForm.value.announce,
      history_public_to_subscribers: this.streamForm.value.teamHistory,


      // Todo add more members here. Automatically add current logged in user
      // user_id: [this.loggedUserProfile.email]
    };

    console.log('Team data ===>>', teamData);
  }


  onSubmit(): void {
    this.valideChecks();
    console.log('Form data ==>>', this.streamForm.value);
  }

  onChangeWhoCanPost(value: any): void {
    this.whoCanPost = value;
  }

  submitForm(): any {
    // console.log('public, prish, prino', this.publicF, this.privateTeamInviteShare,  this.privateTeamInviteNo );
    if ( this.publicF !== '' ){
      this.streamForm.controls.announce.setValue(false);
      this.streamForm.controls.teamHistory.setValue(true);
      this.streamForm.controls.teamInvite.setValue(false);

    }

    if ( this.privateTeamInviteShare  !== '' ){
      this.streamForm.controls.announce.setValue(false);
      this.streamForm.controls.teamHistory.setValue(true);
      this.streamForm.controls.teamInvite.setValue(true);

    }

    if ( this.privateTeamInviteNo  !== '' ){
      this.streamForm.controls.announce.setValue(false);
      this.streamForm.controls.teamHistory.setValue(false);
      this.streamForm.controls.teamInvite.setValue(true);
    }


    const teamData = {
      name: this.streamForm.value.teamName,
      description: this.streamForm.value.teamDescription,
      // user_id: [this.loggedUserProfile.email, ...this.selectedUserEmail],
      authorization_errors_fatal: this.streamForm.value.authErr,

      invite_only: this.streamForm.value.teamInvite,
      announce: this.streamForm.value.announce,
      history_public_to_subscribers: this.streamForm.value.teamHistory,


      // Todo add more members here. Automatically add current logged in user
      // user_id: [this.loggedUserProfile.email]
    };

    console.log('Team data ===>>>', teamData);

    //   this.messagingService.createTeam(teamData).subscribe((response: any) => {
    //     console.log('the team data=====', teamData);
    //     if (response['zulip message'].result === 'success'){
    //       this.dialogRef.close('success');
    //       this.notificationService.showSuccess(`Team ${teamData.name} created`, 'Team created');
    //     }else{
    //       this.notificationService.showError(`Unable to create ${teamData.name} at this time`, 'Team not created');
    //     }
    //   });
  }

  addAllUsers(): void {
    this.users$.subscribe(
      (users: ZulipSingleUser[]) => {
        this.selectedSubscribers = users;
      }
    );
  }

  addToSelected(): void {
    this.oneByOneUser.map(
      (user: ZulipSingleUser) => {
        if (this.selectedSubscribers.includes(user)) { return; }
        this.selectedSubscribers.push(user);
      }
    );
    this.oneByOneUser = [];
  }

  removeUser(userId: number): void {
    this.selectedSubscribers = this.selectedSubscribers.filter(user => +user.user_id !== userId);
  }

  removeFromOneByOneUser(person: any): void {
    this.oneByOneUser = this.oneByOneUser.filter(user => user.user_id !== person.user_id);
  }

  addSingleUser(member: any): void {
    if (this.oneByOneUser.includes(member)) { return; }
    this.oneByOneUser.push(member);
    this.filterWord = '';
  }
}
