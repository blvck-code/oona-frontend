import {Component, Input, OnInit} from '@angular/core';
import {MessagingService} from '../services/messaging.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../auth/services/auth.service';

@Component({
  selector: 'app-meeting-card',
  templateUrl: './meeting-card.component.html',
  styleUrls: ['./meeting-card.component.scss']
})
export class MeetingCardComponent implements OnInit {

  @Input() meetingDetails: any;
  @Input() startMeetingOption = false;
   attendees = Array();
  isIframeLoading = false;

  constructor(
    public messagingService: MessagingService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  goToMeeting(): void {
    this.authService.saveCurrentMeetingId(this.meetingDetails.id);
    this.isIframeLoading = true;
    this.startCurrentMeeting(this.meetingDetails.id);
  }

  startCurrentMeeting(meetingId: string): any {
    setTimeout(() => {
      this.router.navigate(['/dashboard/calls/' + meetingId]);
      this.isIframeLoading = false;
    }, 3000);
  }
}
