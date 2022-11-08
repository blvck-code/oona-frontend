import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { oonaBaseUrl } from 'src/environments/environment';
import { MessagingService } from '../../services/messaging.service';

@Component({
  selector: 'app-team-messaging-right-panel',
  templateUrl: './team-messaging-right-panel.component.html',
  styleUrls: ['./team-messaging-right-panel.component.scss'],
})
export class TeamMessagingRightPanelComponent implements OnInit {
  allUsers: any;
  serverUrl = oonaBaseUrl;
  allSubscribers: any;

  groupMemberDetails = Array();
  otherMemberDetails = Array();
  streamName: any;

  constructor(
    private router: Router,
    public messagingService: MessagingService,
    private route: ActivatedRoute,
    private change: ChangeDetectorRef,
  ) {
  }



  ngOnInit(): void {
    this.onInitHandler();
  }

  onInitHandler(): void {
    this.allUsersRegistered();
    this.route.queryParams.subscribe((params) => {
      this.getSubscribersOfTeam(params.id);
    });
  }
  allUsersRegistered(): void {
    this.messagingService
      .getUsersByAvailability()
      .subscribe((users: { members: any[] }) => {
        const usersPresent = users.members.filter((user) => user.presence);
        this.allUsers = this.messagingService.newListOfUsers(usersPresent);
      });
  }

  goToMemberChat(member: any): void {
    this.router.navigate(['dashboard/messaging/narrow'], {
      queryParams: {
        member: member.full_name.toLowerCase().replace(/\s/g, '.'),
      },
    });
  }

  getAllSubscribers(): any {
    this.messagingService
      .getAllSubscribedStreams()
      .subscribe((subscribers: { subscriptions: any; name: any }) => {
        this.allSubscribers = subscribers.subscriptions;
      });
    // tslint:disable-next-line:max-line-length
    // this.allSubscribers = await this.messagingService.getAllSubscribedStreams().subscribe((stream: { subscriptions: any; }) => stream.subscriptions);
  }

  getSubscribersOfTeam(streamId: any): void {
    // re-initialize these arrays as empty each time this method is called.
    this.groupMemberDetails = [];
    this.otherMemberDetails = [];
    if (streamId) {
      this.getDetails(streamId);
    } else {
      // ! get data from the URL if the params does not change but the browser is refreshed
      //  tslint:disable-next-line:no-shadowed-variable
      const streamId = window.location.href.split('id=')[1];
      this.getDetails(streamId);
    }
  }
  getDetails(streamId: string): void {
    // this has been placed here because this particular query takes a lot of time.
    this.messagingService
      .getAllSubscribedStreams()
      .subscribe((subscribers: { subscriptions: any; name: any }) => {
        this.allSubscribers = subscribers.subscriptions;
        // tslint:disable-next-line:max-line-length
        const allEmailsSubscribed = subscribers.subscriptions.find(
          (teams: { stream_id: any }) => teams.stream_id === Number(streamId)
        ).subscribers;
        const streamName = subscribers.subscriptions.find(
          (teams: { stream_id: any }) => teams.stream_id === Number(streamId)
        ).name;
        this.messagingService.changeStreamName(streamName);
        // * filter out from all users, details of those whose emails have been subscribed
        // tslint:disable-next-line:jsdoc-format
        const allUsers = this.messagingService.allPlatformMembers;

        // @ts-ignore
        this.allUsers.forEach((user) => {
          // @ts-ignore
          if (allEmailsSubscribed.includes(user.email)) {
            this.groupMemberDetails.push(user);
          } else {
            this.otherMemberDetails.push(user);
          }
        });
        this.change.detectChanges();
        this.messagingService.changeCurrentStreamMemberNames(
          this.groupMemberDetails
        );
      });
  }

  compare(member1: any, member2: any): number {
    // place first member before second
    if (
      member1.presence.website.status === 'active' &&
      member2.presence.website.status === 'idle'
    ) {
      return -1;
    }
    // // place second member before first
    if (
      member1.presence.website.status === 'idle' &&
      member2.presence.website.status === 'active'
    ) {
      return 1;
    }
    if (member1.full_name < member2.full_name) {
      return -1;
    }
    if (member1.full_name > member2.full_name) {
      return 1;
    }
    return 0;
  }

}
