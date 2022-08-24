import {AfterViewInit, ChangeDetectorRef, Component, forwardRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../auth/services/auth.service';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {OonaUser} from '../shared/oonaUser';
import {HomeService} from '../shared/home.service';
import {OonaMeeting} from '../shared/oonaMeeting';
import { CalendarOptions, Calendar} from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';

@Component({
  selector: 'app-upcoming-meetings',
  templateUrl: './upcoming-meetings.component.html',
  styleUrls: ['./upcoming-meetings.component.scss']
})
export class UpcomingMeetingsComponent implements OnInit, AfterViewInit {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private homeService: HomeService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  searchText = '';
  allMeetings: OonaMeeting[] = [];
  upComingMeetings: OonaMeeting[] = [];
  previousMeetings: OonaMeeting[] = [];

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

  // Edit Meeting Variables
  defaultEditMeetingDate = new FormControl(new Date());
  selectedMeetingDate = '';
  selectedMeetingTime = '';
  selectedMeetingName = '';
  selectedMeetingAgenda = '';
  selectedMeetingPriority = 0;
  selectedMeetingDuration = 0;
  areMeetingDetailsLoading = false;
  editInvitedUsers: string[] = [];
  editDisplayInvitedUsers: OonaUser[] = [];
  selectedMeetingHost: any;
  editMeetingId = '';
  @ViewChild('editCloseButton') editCloseButton: any;
  endMeetingTime: any;

  // Delete Meeting Variables

  deleteMeetingId = '';
  deleteMeetingName = '';
  @ViewChild('deleteMeetingButton') deleteMeetingButton: any;

  // Calendar

  // @ts-ignore
  calendarOptions: CalendarOptions;
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

  editMeetingForm = this.formBuilder.group({
    editMeetingDate: [(new Date()), Validators.required],
    editMeetingTime: [(new Date()), Validators.required],
    editMeetingName: ['', Validators.required],
    editMeetingAgenda: ['', Validators.required],
    editMeetingAttendees: [(this.invitedUsers), Validators.required],
    editMeetingDuration: [(this.meetingLength[0])],
    editMeetingPriority: [this.meetingPriority[this.selectedMeetingPriority]]
  });

  ngOnInit(): void {
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

  ngAfterViewInit(): void {
    const editMeetingModal = document.getElementById('editMeetingModal');
    // @ts-ignore
    editMeetingModal.addEventListener('hidden.bs.modal', () => {
      this.editInvitedUsers.length = 0;
      this.editDisplayInvitedUsers.length = 0;
    });
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
          this.allMeetings = meetingsRes.results;
          this.upComingMeetings = meetingsRes.results.filter( (meeting: any) => {
            const date = new Date(meeting.start_time);
            return date >= new Date();
          });
          this.previousMeetings = meetingsRes.results.filter( (meeting: any) => {
            const date = new Date(meeting.start_time);
            return date <= new Date();
          });
          this.areMeetingsLoading = false;
        },
        (meetingsError: any) => {
          this.areMeetingsLoading = false;
          // console.log('Meetings Error', meetingsError);
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
    this.meetingForm.patchValue({
      meetingTime: dayjs(new Date()).format('HH:mm')
    });
    this.homeService.getAllUsers().subscribe(
      (users: any) => {
        this.oonaUsers = users.results;
      }
    );
  }

  setMeetingDetails(id: string): any {
    this.authService.getCurrentMeeting(id)
      .subscribe(
        (meetingRes: any) => {
          this.authService.saveCurrentMeetingId(meetingRes.id);
          this.isIframeLoading = true;
          this.startCurrentMeeting(id);
        }
      );
  }

  startCurrentMeeting(meetingId: string): any {
    setTimeout(() => {
      this.router.navigate(['/dashboard/calls/' + meetingId]);
      this.isIframeLoading = false;
    }, 3000);
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
    this.hostError = false;
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
            this.getAllMeetings();
          },
          (meetingError: any) => {
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
      this.hostError = false;
    }

    getMeetingToDelete(id: string): any {
      this.homeService.getMeetingDetails(id)
        .subscribe(
          (meetingRes: any) => {
            this.deleteMeetingId = meetingRes.id;
            this.deleteMeetingName = meetingRes.name;
          }
        );
    }

    deleteThisMeeting(): any {
    this.homeService.deleteMeeting(this.deleteMeetingId)
      .subscribe(
        (deleteRes: any) => {
          this.deleteMeetingButton.nativeElement.click();
        }
      );
    }

    // Update Meetings Section

  getSelectedMeeting(id: string): any {

    this.getUsers();
    this.homeService.getMeetingDetails(id)
      .subscribe(
        (meetingRes: any) => {
          this.defaultEditMeetingDate = new FormControl(new Date(meetingRes.start_time));
          this.selectedMeetingDate = dayjs(meetingRes.start_time).format('YYYY-MM-DD');
          this.selectedMeetingTime = dayjs(meetingRes.start_time).format('HH:mm');
          this.selectedMeetingName = meetingRes.name;
          this.selectedMeetingAgenda = meetingRes.agenda;
          this.selectedMeetingPriority = this.getEditDisplayPriority(meetingRes.priority);
          this.selectedMeetingDuration = this.getMeetingDuration(meetingRes.start_time, meetingRes.stop_time);
          this.editDisplayInvitedUsers = meetingRes.attendees_name;
          this.selectedMeetingHost = meetingRes.host_name.id;
          this.editMeetingId = meetingRes.id;
          this.editDisplayInvitedUsers.forEach((user) => {
            this.editInvitedUsers.push(user.id);
          });
          flatpickr('#oonaCalendar', {
            wrap: true,
            minDate: new Date(),
            defaultDate: this.selectedMeetingDate
          });
          flatpickr('#oonaEditTime', {
            enableTime: true,
            noCalendar: true,
            dateFormat: 'H:i',
            time_24hr: true,
            defaultDate: this.selectedMeetingTime,
            static: true
          });
          this.updateMeetingDetails();
    }
      );
  }
  updateMeetingDetails(): any {
    this.editMeetingForm.patchValue({
      editMeetingName: this.selectedMeetingName,
      editMeetingDate: this.selectedMeetingDate,
      editMeetingTime: this.selectedMeetingTime,
      editMeetingAgenda: this.selectedMeetingAgenda,
      editMeetingDuration: this.meetingLength[this.selectedMeetingDuration],
      editMeetingPriority: this.meetingPriority[this.selectedMeetingPriority]
    });
  }
  getMeetingDuration(startTime: string, endTime: string): any {
    const duration = Date.parse(endTime) - Date.parse(startTime);
    switch (duration) {
      case 900000:
        return 0;
      case 1800000:
        return 1;
      case 2700000:
        return 2;
      case 3600000:
        return 3;
      case 5400000:
        return 4;
      default:
        return 1;
    }
  }
  getEditDisplayPriority(apiPriority: number): any {
    switch (apiPriority) {
      case 3:
        return 0;
      case 4:
        return 1;
      case 5:
        return 2;
      default:
        return 1;
    }
  }
  editMeetingSelectedUser(user: OonaUser): any {
    this.editDisplayInvitedUsers.push(user);
    this.editInvitedUsers.push(user.id);
  }

  onEditRemoveUser(user: OonaUser): any {
    const userDisplayIndex = this.editDisplayInvitedUsers.indexOf(user);
    const userAddIndex =  this.editInvitedUsers.indexOf(user.id);
    this.editDisplayInvitedUsers.splice(userDisplayIndex, 1);
    this.editInvitedUsers.splice(userAddIndex, 1);
  }

  updateForm(): any {
    // Set meeting Start Time
    const meetingDate = this.editMeetingForm.value.editMeetingDate;
    const meetingTime = this.editMeetingForm.value.editMeetingTime;
    const meetingStartTime = meetingDate + ' ' + meetingTime + `:` + `00`;

    // Set Meeting End Time
    const duration = this.editMeetingForm.value.editMeetingDuration;
    this.changeDetector.detectChanges();

    if (duration === '15 Min') {
      this.endMeetingTime = dayjs(meetingStartTime).add(15, 'm');
    } else if (duration === '30 Min') {
      this.endMeetingTime = dayjs(meetingStartTime).add(30, 'm');
    } else if (duration === '45 Min') {
      this.endMeetingTime = dayjs(meetingStartTime).add(45, 'm');
    } else if (duration === '1 Hr') {
      this.endMeetingTime = dayjs(meetingStartTime).add(60, 'm');
    } else if (duration === '1 Hr 30 Min') {
      this.endMeetingTime = dayjs(meetingStartTime).add(90, 'm');
    }

    // Set Meeting Priority
    const editMeetingPriority = this.getMeetingPriority(this.editMeetingForm.value.editMeetingPriority);
    this.changeDetector.detectChanges();


    const editMeetingData = {
      name: this.editMeetingForm.value.editMeetingName,
      agenda: this.editMeetingForm.value.editMeetingAgenda,
      start_time: meetingStartTime,
      stop_time: dayjs(this.endMeetingTime).format('YYYY-MM-DD HH:mm:ss'),
      host: this.selectedMeetingHost,
      attendees: this.editInvitedUsers
    };


    this.homeService.editMeeting(editMeetingData, this.editMeetingId)
      .subscribe(
        (editMeetingRes: any) => {
          this.editCloseButton.nativeElement.click();
          this.ngOnInit();
        },
        (editMeetingErr: any) => {
          // console.log('edit Meeting Error', editMeetingErr);
        }
      );
  }

}

