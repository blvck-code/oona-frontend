import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {MessagingService} from '../../services/messaging.service';
import * as authActions from '../../../../auth/state/auth.actions';
import {environment} from '../../../../../environments/environment';

import {NotificationService} from '../../../../shared/services/notification.service';
import {getAllUsers, getZulipUsers} from '../../../../auth/state/auth.selectors';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-individual-messaging-right-panel',
  templateUrl: './individual-messaging-right-panel.component.html',
  styleUrls: ['./individual-messaging-right-panel.component.scss']
})

export class IndividualMessagingRightPanelComponent implements OnInit {
  otherMembers: any ;
  allUsers: any;
  // serverUrl = environment.oona;
  commonTeams = Array();
  memberDetails = {
    full_name: undefined,
    bot_type: undefined,
    is_admin: undefined,
    is_active: undefined,
    user_id: undefined,
    is_bot: undefined,
    is_guest: undefined,
    avatar_url: undefined,
    email: undefined
  };
  memberParamName = '';
  allSubscribers: any;
  loggedInUserProfile: any;
  oonaProfile: any ;
  profileCreationDate: any;
  @Input() currentUser: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messagingService: MessagingService,
    private  notificationService: NotificationService,
    private store: Store<AppState>,
    private change: ChangeDetectorRef
  ) {
    this.allUsersRegistered();
    this.getAllSubscribers();
  }

  allUsersRegistered(): void {
    this.messagingService.getUsersByAvailability().subscribe((users: { members: any[]; }) => {
      const usersPresent = users.members.filter(user => user.presence );
      this.allUsers = this.messagingService.newListOfUsers(usersPresent);
    });

  }

  getCurrentUser(): void {
    const currentUser = this.route.snapshot.queryParams?.member;

    const userId = currentUser.split('-')[0];
    const userName = currentUser.split('-')[1].replace('.', ' ');

    console.log('Current ==>>', {
      id: userId,
      name: userName
    });

    this.store.select(getAllUsers).subscribe(
      data => {
        const users = data?.members;

        users?.forEach((user: any) => {
          const name = user?.full_name.toLowerCase();
          const id = user?.user_id;


          if (id === userId) {
            this.currentUser = user;
            console.log('currentUser ===>>>', user);
          }
        });
      }
    );
  }

  onInitHandler(): void {
  }
  ngOnInit(): void {
    this.onInitHandler();


    this.route.queryParams
      .subscribe(params => {
          this.allOtherMembers(params.member);
          this.getCommonTeams();
        }
      );

  }

  allOtherMembers(memberName: string): void{
    this.otherMembers = [];

    setTimeout( () => {
      // @ts-ignore
      this.allUsers.forEach((user) => {
        // @ts-ignore
        if (user.full_name.replace(/\s/g, '') === memberName){
          this.memberDetails = user;
          this.messagingService.changeMemberDetail(user);
          this.updateProfile();
        }else{
          this.otherMembers.push(user);
        }
      });
    }, 500);

  }

  goToMemberChat(member: any): void{
    // tslint:disable-next-line:max-line-length
    const userUrl = `${member.user_id}-${member.full_name.replace(/\s/g, '.')}`;
    // this.router.navigate(['dashboard/messaging/narrow'], { queryParams: { member: member.full_name.replace(/\s/g, '') } });
    this.router.navigate(['dashboard/messaging/narrow'], { queryParams: { member: userUrl } });
  }
  updateProfile(): void{
    this.messagingService.getOonaMemberDetail(this.memberDetails.email).subscribe((oonaProfileData: { results: any; }) => {
      if (oonaProfileData.results[0]){
        this.oonaProfile  = oonaProfileData.results[0];
        this.profileCreationDate = new Date(oonaProfileData.results[0].created_at);
      }else{
        this.oonaProfile  = 'Unknown';
        this.profileCreationDate = 'Unknown';
      }
    });
  }

  private getAllSubscribers(): void {
    this.messagingService.getAllSubscribedStreams().subscribe(
      ( subscribers: { subscriptions: any; name: any; }) => {
        this.allSubscribers = subscribers.subscriptions;
      });

    this.messagingService.currentUserProfile().subscribe( (profile: any) => {
      this.loggedInUserProfile = profile.zulip;
    });
  }

  private getCommonTeams(): void{
    // initialize as empty list of common teams each time
    this.commonTeams = [];
    this.messagingService.getAllSubscribedStreams().subscribe(
      ( subscribers: { subscriptions: any; name: any; }) => {
        this.allSubscribers = subscribers.subscriptions;
        // tslint:disable-next-line:max-line-length
        this.commonTeams = subscribers.subscriptions.filter((team: { subscribers: any[]; }) => team.subscribers.includes(this.memberDetails.email) && team.subscribers.includes(this.loggedInUserProfile.email));
        this.change.detectChanges();
      });
    this.change.detectChanges();
  }

  generateMeeting(): void{
    this.messagingService.getOonaMemberDetail(this.memberDetails.email).subscribe((oonaProfileData: { results: any; }) => {
      const meetingAttendees = [];
      if (oonaProfileData.results.length < 1){
        this.notificationService.showWarning(`${this.memberDetails.full_name} is not a member of oona`, 'Not a member of oona');
        return;
      }else{
        meetingAttendees.push(oonaProfileData.results[0].id);
        const currentDate = new Date ();
        const startTimeTimestamp = currentDate.setMinutes(currentDate.getMinutes() + 5);
        const stopTimeTimestamp = new Date(startTimeTimestamp);


        // console.log('start time', this.formatDate(new Date(startTimeTimestamp)));
        // console.log('stop time', this.formatDate(new Date( stopTimeTimestamp.getTime() + 30 * 60000)));
        const meetingDetail = {
          name: `New meeting ${this.messagingService.formatDate(new Date(startTimeTimestamp))}`,
          start_time: this.messagingService.formatDate(new Date(startTimeTimestamp)),
          stop_time:  this.messagingService.formatDate(new Date( stopTimeTimestamp.getTime() + 30 * 60000)),
          priority: '2',
          attendees: meetingAttendees
        };

        this.messagingService.createMeeting(meetingDetail).subscribe((response: any) => {
          // response.video_stream
          // https://192.168.0.76:8443/67830bfd-7249-4d05-b5a6-5eda9c0c30fa
          this.notificationService.showInfo(`Meeting with ${this.memberDetails.full_name} has been created.`, 'Meeting created');
          setTimeout(() => {
            this.router.navigate(['dashboard']);
          }, 1000);

        });
      }
    });


  }

}
