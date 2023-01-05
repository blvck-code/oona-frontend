import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ZulipSingleUser} from '../../../../../auth/models/user.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {AllStreamsModel} from '../../../models/streams.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../state/app.state';
import {getAllStreams} from '../../../state/messaging.selectors';
import {MessagingService} from '../../../services/messaging.service';
import {SharedService} from '../../../../../shared/services/shared.service';
import {HttpErrorResponse} from '@angular/common/http';

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
  privacyType = '';
  searchText = '';
  filterWord = '';

  @Input() users$!: Observable<ZulipSingleUser[]>;
  @Input() userId$!: Observable<number>;

  streams$!: Observable<AllStreamsModel[]>;

  streamExist = false;
  streamExistSubject = new BehaviorSubject<boolean>(this.streamExist);
  streamExistObservable = this.streamExistSubject.asObservable();

  selectedUserEmail = [];
  selectedSubscribers: any[] = [];
  oneByOneUser: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private messagingService: MessagingService,
    private sharedSrv: SharedService
  ) { }

  streamForm = this.formBuilder.group({
    teamName: ['', Validators.required],
    teamDescription: ['', Validators.required],
    stream_post_policy: [''],
    teamMembers: [''],
    teamInvite: [false],
    announce: [false],
    teamHistory: [false],
    public: [false],
  });

  ngOnInit(): void {
    this.streams$ = this.store.select(getAllStreams);
  }

  handlePrivacyType(type: string): void {
    this.privacyType = type;
    this.validChecks();
  }

  validChecks(): void {

    console.log('Privacy type ==>>', this.privacyType);

    if ( this.privacyType !== 'public' ){
      this.streamForm.controls.public.setValue(true);
      this.streamForm.controls.teamHistory.setValue(false);
      this.streamForm.controls.teamInvite.setValue(false);

    }

    if ( this.privacyType  !== 'privateTeamInviteShare' ){
      this.streamForm.controls.public.setValue(false);
      this.streamForm.controls.teamHistory.setValue(true);
      this.streamForm.controls.teamInvite.setValue(false);

    }

    if ( this.privacyType !== 'privateTeamInviteNo' ){
      this.streamForm.controls.public.setValue(false);
      this.streamForm.controls.teamHistory.setValue(false);
      this.streamForm.controls.teamInvite.setValue(true);
    }
  }

  checkStreamName($event: any): void {
    const streamName = $event.target.value;

    this.streams$.subscribe(
      (streams: AllStreamsModel[]) => {
        streams.map((streamItem: AllStreamsModel) => {
          if (streamItem.name.toLowerCase() === streamName.toLowerCase()) {
            // Todo add stream form to be invalid
            this.streamExistSubject.next(true);
            console.log('A stream with this name already exists');
          } else {
            this.streamExistSubject.next(false);
          }
        });
      }
    );
    console.log('Stream name ==>>', streamName);
  }

  onSubmit(): void {
    this.validChecks();
    const teamData = {
      name: this.streamForm.value.teamName,
      description: this.streamForm.value.teamDescription,
      authorization_errors_fatal: this.streamForm.value.authErr,
      user_id: [...this.getUsersEmail(this.selectedSubscribers)],
      invite_only: this.streamForm.value.teamInvite,
      announce: this.streamForm.value.announce,
      history_public_to_subscribers: this.streamForm.value.teamHistory,
    };

    console.log('Team data ===>>', teamData);
    console.log('Form data ===>>', this.streamForm.value);
    //
    // this.messagingService.subscribeMember(teamData).subscribe({
    //   next: (response: any) => {
    //     if (response['zulip message'].result === 'success'){
    //       this.sharedSrv.showNotification('Stream successfully created', 'success');
    //     }else{
    //       // this.notificationService.showError(`Cannot add ${this.selectedUser.full_name} at this time`, 'Could not add member');
    //     }
    //   },
    //   error: (err: HttpErrorResponse) => console.log('Create stream err ==>>', err)
    // });
  }

  getUsersEmail(users: ZulipSingleUser[]): any {
    const emails: string[] = [];

    users.map((user: ZulipSingleUser) => {
      emails.push(user.email);
    });

    return emails;
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