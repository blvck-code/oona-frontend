import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ZulipSingleUser } from '../../../../../auth/models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { AllStreamsModel } from '../../../models/streams.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../state/app.state';
import { getAllStreams } from '../../../state/messaging.selectors';
import { MessagingService } from '../../../services/messaging.service';
import { SharedService } from '../../../../../shared/services/shared.service';
import { HttpErrorResponse } from '@angular/common/http';
import { getUsers } from '../../../../state/entities/users.entity';
import { PersonModel } from '../../../../models/person.model';
import { getZulipProfileInfo } from '../../../../../auth/state/auth.selectors';

@Component({
  selector: 'app-new-team',
  templateUrl: './new-team.component.html',
  styleUrls: ['./new-team.component.scss'],
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

  users$: Observable<PersonModel[]> = this.store.select(getUsers);
  @Input() userId$!: Observable<number>;

  streams$!: Observable<AllStreamsModel[]>;
  currentUser$: Observable<any> = this.store.select(getZulipProfileInfo);

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
  ) {}

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
    this.currentUser$.subscribe({
      next: (user) => {
        this.selectedSubscribers = [...this.selectedSubscribers, user];
      },
    });
  }

  handlePrivacyType(type: string): void {
    this.privacyType = type;
  }

  onSubmit(): void {
    const teamData = {
      name: this.streamForm.value.teamName,
      description: this.streamForm.value.teamDescription,
      authorization_errors_fatal: this.streamForm.value.authErr,
      user_id: [...this.getUsersEmail(this.selectedSubscribers)],
      invite_only: this.streamForm.value.teamInvite,
      announce: this.streamForm.value.announce,
      history_public_to_subscribers: this.streamForm.value.teamHistory,
    };
    //
    this.messagingService.subscribeMember(teamData).subscribe({
      next: (response: any) => {
        const responseType = response['zulip message'].result;
        const responseMsg = response['zulip message'].msg;
        if (responseType === 'success') {
          this.sharedSrv.showNotification(
            'Stream successfully created',
            'success'
          );
        } else if (responseType === 'error') {
          this.sharedSrv.showNotification(responseMsg, 'error');
        } else {
          this.sharedSrv.showNotification(
            'Failed to create stream, please try again',
            'error'
          );
        }
      },
      error: (err: HttpErrorResponse) =>
        this.sharedSrv.showNotification(
          'Failed to create stream, please try again',
          'error'
        ),
    });
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
    if (this.publicF !== '') {
      this.streamForm.controls.announce.setValue(false);
      this.streamForm.controls.teamHistory.setValue(true);
      this.streamForm.controls.teamInvite.setValue(false);
    }

    if (this.privateTeamInviteShare !== '') {
      this.streamForm.controls.announce.setValue(false);
      this.streamForm.controls.teamHistory.setValue(true);
      this.streamForm.controls.teamInvite.setValue(true);
    }

    if (this.privateTeamInviteNo !== '') {
      this.streamForm.controls.announce.setValue(false);
      this.streamForm.controls.teamHistory.setValue(false);
      this.streamForm.controls.teamInvite.setValue(true);
    }
  }

  addAllUsers(): void {
    this.users$.subscribe((users: PersonModel[]) => {
      this.selectedSubscribers = users;
    });
  }

  addToSelected(): void {
    this.oneByOneUser.map((user: ZulipSingleUser) => {
      if (this.selectedSubscribers.includes(user)) {
        return;
      }
      this.selectedSubscribers.push(user);
    });
    this.oneByOneUser = [];
  }

  removeUser(userId: number): void {
    this.selectedSubscribers = this.selectedSubscribers.filter(
      (user) => +user.user_id !== userId
    );
  }

  removeFromOneByOneUser(person: any): void {
    this.oneByOneUser = this.oneByOneUser.filter(
      (user) => user.user_id !== person.user_id
    );
  }

  addSingleUser(member: any): void {
    if (this.oneByOneUser.includes(member)) {
      return;
    }
    this.oneByOneUser.push(member);
    this.filterWord = '';
  }
}
