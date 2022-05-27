import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MessagingService} from '../../services/messaging.service';
import {HomeService} from '../../../home/shared/home.service';
import {IndividualMessagingService} from '../../individual-messaging/individual-messaging.service';

@Component({
  selector: 'app-team-meetings',
  templateUrl: './team-meetings.component.html',
  styleUrls: ['./team-meetings.component.scss']
})
export class TeamMeetingsComponent implements OnInit {

  @Input() commonMeetingsPassed = Array();
  memberDetail = {
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
  previousMeetings = Array();
  upcomingMeetings = Array();
  commonMeetings = Array();
  private otherIsHost: any;
  private otherIsAttendee: any;
  otherMemberOonaProfile: any;

  constructor(
    private messagingService: MessagingService,
    private homeService: HomeService,
    private individualMessagingService: IndividualMessagingService,
    private change: ChangeDetectorRef
    ) { }

  ngOnInit(): void {

    this.messagingService.currentMemberChatDetail.subscribe(member => {
      this.memberDetail = member;
      setTimeout(() => {
        this.updateMeetings(member.email);
      }, 1000);
    }); // always get the current value
  }

  updateMeetings(memberEmail: any): void{
    // console.log('member email', member);
    this.commonMeetings = [];
    this.individualMessagingService.getOonaProfile(memberEmail).subscribe((res: { results: any[]; }) => {
      this.otherMemberOonaProfile = res.results[0];
      this.individualMessagingService.getMeetingsWhereIdIsHost(res.results[0].id).subscribe((meetings: { results: any; }) => {
        this.otherIsHost = meetings.results;
        this.individualMessagingService.getMeetingsWhereIdIsAttendee(res.results[0].id).subscribe((attendeeMeetings: { results: any; }) => {
          this.otherIsAttendee = attendeeMeetings.results;
          this.commonMeetings = [...this.otherIsHost,  ...attendeeMeetings.results];
          this.sortMeetings();
        });
      });
    });
  }


  private sortMeetings(): void {
    if (this.commonMeetings.length > 0){
      this.previousMeetings = this.commonMeetings.filter( (meeting: any) => {
        const date = new Date(meeting.start_time);
        return date <= new Date();
      });

      this.upcomingMeetings = this.commonMeetings.filter( (meeting: any) => {
        const meetingDate = new Date(meeting.start_time);
        return meetingDate >= new Date();
      });
      this.change.detectChanges();
    }
  }
}
