import {ChangeDetectorRef, Component, forwardRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../auth/services/auth.service';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import { Router} from '@angular/router';
import {HomeService} from '../shared/home.service';
import {OonaUser} from '../shared/oonaUser';
import {OonaMeeting} from '../shared/oonaMeeting';
import { CalendarOptions, Calendar} from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import {Store} from '@ngrx/store';
import {AppState} from '../../../state/app.state';
import {getZulipProfile} from '../../../auth/state/auth.selectors';

@Component({
  selector: 'app-previous-meetings',
  templateUrl: './previous-meetings.component.html',
  styleUrls: ['./previous-meetings.component.scss']
})
export class PreviousMeetingsComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private homeService: HomeService,
    private changeDetector: ChangeDetectorRef,
    private store: Store<AppState>

  ) { }

  loggedInUserId = '';
  previousMeetings: OonaMeeting[] = [];
  searchText = '';

  signupError = false;
  signupServerError = '';
  timeError = false;
  hostError = false;
  emptyForm = false;
  attendeeListOpen = false;
  startMeetingNow = false;
  today = new Date();
  yesterday = this.today.setDate(this.today.getDate() - 1);
  min =  new Date(this.yesterday);
  meetingLength = [
    '15 Min',
    '30 Min',
    '45 Min',
    '1 Hr',
    '1 Hr 30 Min'
  ];
  meetingPriority = [
    'High Priority',
    'Normal Priority',
    'Low Priority'
  ];
  oonaUsers: OonaUser[] = [];
  invitedUsers: string[] = [];
  displayInvitedUsers: OonaUser[] = [];
  meetingStartDates = '';
  @ViewChild('closeButton') closeButton: any;
  isIframeLoading = false;
  areMeetingsLoading = false;
  newMeetingEndTime: any;

// Calendar

  // @ts-ignore
  calendarOptions: CalendarOptions;
  eventsModel: any;
  // @ts-ignore
  @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;

  // Build Form
  meetingForm = this.formBuilder.group({
    time: ['', [Validators.required, Validators.email]],
    meetingDate: [(new Date()), Validators.required],
    meetingTime: [(new Date()), Validators.required],
    meetingName: ['', Validators.required],
    meetingAgenda: ['', Validators.required],
    attendees: [(this.invitedUsers), Validators.required],
    meetingDuration: [(this.meetingLength[0])],
    meetingPriority: [this.meetingPriority[1]]
  });

  getUserInfo(): void {
    this.store.select(getZulipProfile).subscribe(
      ((user: any) => this.loggedInUserId = user?.oz.id)
    );
  }
  ngOnInit(): void {
    this.getUserInfo();

    if (this.authService.isTokenExpiring()) {
      this.authService.refreshToken();
    }
    this.areMeetingsLoading = true;
    this.getAllMeetings();

    forwardRef(() => Calendar);

    this.calendarOptions = {
      plugins: [dayGridPlugin],
      editable: true,
      contentHeight: 300,
      customButtons: {
      },
      headerToolbar: {
        left: 'prev,next',
        right: 'title'
      },
    };
  }

  handleChange(e: any): any {
    // console.log('Event ==>>', e);
  }

  updateHeader(): any {
    this.calendarOptions.headerToolbar = {
      left: 'prev,next',
      center: 'title',
      right: ''
    };
  }

  getAllMeetings(): any {
    this.homeService.getAllMeetings()
      .subscribe(
        (meetingsRes: any) => {
          this.previousMeetings = meetingsRes.results.filter( (meeting: any) => {
            const date = new Date(meeting.start_time);
            return date <= new Date();
          });
          this.areMeetingsLoading = false;
        },
        (meetingsError: any) => {
          this.areMeetingsLoading = false;
          // console.log('Get Meetings, Server Error', meetingsError);
        }
      );
  }

  openAttendeesList(): any {
    this.attendeeListOpen = !this.attendeeListOpen;
  }

  getUsers(): any {
    flatpickr('#oonaMeetingDate', {
      wrap: true,
      minDate: new Date(),
      defaultDate: new Date()
    });
    flatpickr('#oonaMeetingTime', {
      enableTime: true,
      noCalendar: true,
      dateFormat: 'H:i',
      time_24hr: true,
      defaultDate:  new Date(),
      static: true
    });
    this.homeService.getAllUsers().subscribe(
      (users: any) => {
        const results = users.results;
        // Remove logged in user
        for (let i = 0; i < results.length; i++) {
          if ( results[i].id === this.loggedInUserId ){
            results.splice(i, 1);
          }
        }
        this.oonaUsers = results;
      }
    );
  }

  selectedUser(user: OonaUser): any {
    this.displayInvitedUsers.push(user);
    this.invitedUsers.push(user.id);
  }

  onRemoveUser(user: OonaUser): any {
    const userDisplayIndex = this.displayInvitedUsers.indexOf(user);
    const userAddIndex =  this.invitedUsers.indexOf(user.id);
    this.displayInvitedUsers.splice(userDisplayIndex, 1);
    this.invitedUsers.splice(userAddIndex, 1);
  }

  getMeetingPriority(priority: string): any {
    if (priority === 'High Priority') {
      return 3;
    } else if (priority === 'Normal Priority') {
      return 4;
    } else if (priority === 'Low Priority') {
      return 5;
    }
  }

  scheduleMeeting(): any {
    this.isSubmitted();
    this.startMeetingNow = false;
  }

  startMeeting(): any {
    this.startMeetingNow = true;
    this.isSubmitted();
  }


  submitForm(): any {

    // Set meeting Start Time
    const meetingDate = dayjs(this.meetingForm.value.meetingDate).format('YYYY-MM-DD');
    const meetingTime = this.meetingForm.value.meetingTime;
    const meetingStartTime = meetingDate + ' ' + meetingTime + `:` + `00`;

    // Set Meeting End Time
    const duration = this.meetingForm.value.meetingDuration;
    this.changeDetector.detectChanges();

    if (duration === '15 Min') {
      this.newMeetingEndTime = dayjs(meetingStartTime).add(15, 'm');
    } else if (duration === '30 Min') {
      this.newMeetingEndTime = dayjs(meetingStartTime).add(30, 'm');
    } else if (duration === '45 Min') {
      this.newMeetingEndTime = dayjs(meetingStartTime).add(45, 'm');
    } else if (duration === '1 Hr') {
      this.newMeetingEndTime = dayjs(meetingStartTime).add(60, 'm');
    } else if (duration === '1 Hr 30 Min') {
      this.newMeetingEndTime = dayjs(meetingStartTime).add(90, 'm');
    }

    // Set Meeting Priority
    const meetingPriority = this.getMeetingPriority(this.meetingForm.value.meetingPriority);
    this.changeDetector.detectChanges();


    const meetingData = {
      name: this.meetingForm.value.meetingName,
      agenda: this.meetingForm.value.meetingAgenda,
      start_time: meetingStartTime,
      stop_time: dayjs(this.newMeetingEndTime).format('YYYY-MM-DD HH:mm:ss'),
      priority: meetingPriority,
      attendees: this.invitedUsers
    };

    this.homeService.scheduleMeeting(meetingData)
      .subscribe(
        (res: any) => {
          this.closeButton.nativeElement.click();
          this.invitedUsers = [];
          this.displayInvitedUsers = [];
          this.meetingForm.value.meetingName.reset;
          this.meetingForm.value.meetingAgenda.reset;
          this.emptyForm = false;
          if (this.startMeetingNow) {
            const meetingId = res.id;
            this.authService.saveCurrentMeetingId(meetingId);
            setTimeout(() => {
              this.router.navigate(['/dashboard/calls/' + meetingId]);
            }, 2500);
          }
        },
        (meetingError: any) => {
          // console.log('Schedule Meeting Error:', meetingError);
          this.signupError = true;
          if (meetingError.error.non_field_errors.length > 0 && meetingError.error.non_field_errors[0] !== 'Host can\'t be an attendee') {
            this.timeError = true;
          } else if (meetingError.error.non_field_errors[0] === 'Host can\'t be an attendee') {
            this.hostError = true;
          }
        }

      );
  }

  get meetingFormControls(): any {
    return this.meetingForm.controls;
  }

  isSubmitted(): any {
    if (!this.meetingForm.valid) {
      this.emptyForm = true;
    }
  }

}
