import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../auth/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HomeService} from '../shared/home.service';
import {OonaMeeting} from '../shared/oonaMeeting';

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.scss'],
})
export class MeetingDetailsComponent implements OnInit {
  isIframeLoading = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private homeService: HomeService
  ) {
  }

  meetingDetails: OonaMeeting = {
    agenda: '',
    attendees_name: [{email: '', first_name: '', id: '', last_name: ''}],
    host_name: {email: '', first_name: '', id: '', last_name: ''},
    id: '',
    name: '',
    priority: 0,
    start_time: new Date(),
    stop_time: new Date(),
  };

  ngOnInit(): void {
    if (this.authService.isTokenExpiring()) {
      this.authService.refreshToken();
    }
    this.getMeetingDetails();
  }

  getMeetingDetails(): any {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.homeService.getMeetingDetails(id).subscribe((meetingRes: any) => {
      this.meetingDetails = meetingRes;
    });
  }

  startCurrentMeeting(meetingId: string): any {
    setTimeout(() => {
      this.router.navigate(['/dashboard/calls/' + meetingId]);
      this.isIframeLoading = false;
    }, 3000);
  }

  setMeetingDetails(): any {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.authService.getCurrentMeeting(id)
      .subscribe(
        (meetingRes: any) => {
          this.authService.saveCurrentMeetingId(meetingRes.id);
          this.isIframeLoading = true;
          this.startCurrentMeeting(id);
        }
      );

  }
}
