import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationExtras, NavigationStart, Router} from '@angular/router';
import {MessagingService} from '../../services/messaging.service';
import * as authActions from '../../../../auth/state/auth.actions';
import {environment} from '../../../../../environments/environment';

import {NotificationService} from '../../../../shared/services/notification.service';
import {getAllUsers, getLoadingUsers, getSelectedUser, getZulipUsers, getZulipUsersMembers} from '../../../../auth/state/auth.selectors';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import {Observable} from 'rxjs';
import {getSubStreams} from '../../state/messaging.selectors';
import {load} from '@syncfusion/ej2-angular-richtexteditor';


@Component({
  selector: 'app-individual-messaging-right-panel',
  templateUrl: './individual-messaging-right-panel.component.html',
  styleUrls: ['./individual-messaging-right-panel.component.scss']
})

export class IndividualMessagingRightPanelComponent implements OnInit {
  // otherMembers: any ;
  allUsers: any;
  loadingUsers = false;
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
    email: undefined,
    date_joined: undefined,
  };
  memberParamName = '';
  allSubscribers: any;
  loggedInUserProfile: any;
  oonaProfile: any ;
  profileCreationDate: any;
  currentUser: any;
  currentUser$!: Observable<any>;
  zulipUsers$!: Observable<any>;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messagingService: MessagingService,
    private  notificationService: NotificationService,
    private store: Store<AppState>,
    private change: ChangeDetectorRef
  ) {
    this.filterURL();
    this.allUsersRegistered();
    this.getAllSubscribers();
  }

  allUsersRegistered(): void {
    // this.messagingService.getZulipUsers().subscribe((users: { members: any[]; }) => {
    //   const usersPresent = users.members.filter(user => user?.presence );
    //   this.allUsers = this.messagingService.newListOfUsers(usersPresent);
    // });

    this.zulipUsers$ = this.store.select(getZulipUsers);

    // this.store.select(getLoadi).subscribe(
    //   loading => {
    //     if (!loading) {
    //       this.store.select(getZulipUsers).subscribe(
    //         users => {
    //           console.log('Zulip users ===>>>', users);
    //           const usersPresent = users?.filter((user: any) => user?.presence );
    //           this.allUsers = this.messagingService.newListOfUsers(usersPresent);
    //         }
    //       );
    //     }
    //   }
    // );
  }

  getCurrentUser(userId: number): void {
    // const currentUser = this.route.snapshot.queryParams?.member;
    //
    // const userId = currentUser.split('-')[0];
    // const userName = currentUser.split('-')[1].replace('.', ' ');
    //
    if (userId) {
      this.store.select(getAllUsers).subscribe(
        data => {
          // tslint:disable-next-line:no-shadowed-variable
          // this.currentUser = data?.find((user: any) => user.user_id === +userId);
          const currentUser = data?.filter((user: any) => user.user_id === +userId);

          data?.map((user: any) => {
            user?.userId === userId ? console.log('User found ===>>>', user) : null;
          });

          console.log('currentUser ===>>>', userId);
        }
      );
    }

    this.store.select(getSelectedUser).subscribe(
      user => {
        this.currentUser = user;
      }
    );
  }

  changeContentOnRouteChange(): void {
    // @ts-ignore
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.store.select(getSelectedUser).subscribe(
          user => this.currentUser = user
        );
      }
    });

  }

  ngOnInit(): void {
    this.changeContentOnRouteChange();
  }

  filterURL(): void {
    this.route.queryParams
      .subscribe(params => {
          const userId = params.member.split('-')[0];
          const userName = params.member.split('-')[1].replace('.', ' ');
          this.getCurrentUser(+userId);
          console.log('Url info ===>>>', params);
          this.getCommonTeams();
        }
      );
  }

  // onInitHandler(userId: any): void {
  //   this.otherMembers = [];
  //   this.store.select(getAllUsers).subscribe(
  //
  //     data => {
  //
  //       setTimeout( () => {
  //         // @ts-ignore
  //         this.allUsers?.forEach((user) => {
  //           if (+user.user_id === +userId){
  //             this.memberDetails = user;
  //             this.currentUser = user;
  //             this.messagingService.changeMemberDetail(user);
  //             this.updateProfile();
  //           }else{
  //             this.otherMembers = [...this.otherMembers, user];
  //             // this.otherMembers.push(user);
  //
  //             console.log('Other members ===>>>', this.otherMembers);
  //           }
  //         });
  //       }, 3000);
  //     }
  //   );
  //   this.allUsers?.map((user: any) => console.log('User info: ', user));
  // }

  // allOtherMembers(memberName: string): void{
  //   this.otherMembers = [];
  //
  //   setTimeout( () => {
  //     // @ts-ignore
  //     this.allUsers?.forEach((user) => {
  //       // @ts-ignore
  //       if (user.full_name.replace(/\s/g, '') === memberName){
  //         this.memberDetails = user;
  //         this.messagingService.changeMemberDetail(user);
  //         this.updateProfile();
  //       }else{
  //         this.otherMembers = [...this.otherMembers, user];
  //         // this.otherMembers.push(user);
  //       }
  //     });
  //   }, 3000);
  //
  // }

  goToMemberChat(member: any): void{
    // tslint:disable-next-line:max-line-length
    const userUrl = `${member.user_id}-${member.full_name.replace(/\s/g, '.').toLowerCase()}`;
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
        this.commonTeams = subscribers.subscriptions.filter(
          (team: { subscribers: any[]; }) =>
            team.subscribers?.includes(this.memberDetails.email) && team.subscribers?.includes(this.loggedInUserProfile.email)
        );
        this.change.detectChanges();
      });
    this.change.detectChanges();

    this.store.select(getSubStreams).subscribe(
      data => {
        this.allSubscribers = data;
        this.commonTeams = data?.filter(
          (team: any) =>
            // @Todo Subscribed api not giving subscribers, check on zulip documentation
            team.subscribers?.includes(this.memberDetails.email) && team.subscribers?.includes(this.loggedInUserProfile.email)
        );
      }
    );
  }

  generateMeeting(): void{
    console.log('Member ==>>>', this.currentUser);
    this.messagingService.getOonaMemberDetail(this.currentUser.email).subscribe((oonaProfileData: { results: any; }) => {
      const meetingAttendees = [];
      if (oonaProfileData.results.length < 1){
        this.notificationService.showWarning(`${this.currentUser.full_name} is not a member of oona`, 'Not a member of oona');
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
          this.notificationService.showInfo(`Meeting with ${this.currentUser.full_name} has been created.`, 'Meeting created');
          setTimeout(() => {
            this.router.navigate(['dashboard']);
          }, 1000);

        });
      }
    });


  }

}
