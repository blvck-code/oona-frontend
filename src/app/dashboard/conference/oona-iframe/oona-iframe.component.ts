import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OonaUser } from '../../home/shared/oonaUser';
import { OonaMeeting } from '../../home/shared/oonaMeeting';
import { ConferenceService } from '../shared/conference.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MeetingParticipant } from '../shared/meetingParticipant';
import { environment as env } from '../../../../environments/environment';
import { environment } from '../../../../environments/environment';

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-oona-iframe',
  templateUrl: './oona-iframe.component.html',
  styleUrls: ['./oona-iframe.component.scss'],
})
export class OonaIframeComponent implements OnInit, AfterViewInit, OnDestroy {
  // @ToDo white domain URL not similar
  domain = env.domain;
  room: any;
  options: any;
  api: any;
  user: any;
  // @ToDo white board URL not similar
  whiteboardUrl = env.whiteBoard;

  isAudioMuted = false;
  isVideoMuted = false;
  screenSharingOn = false;
  isRecording = false;
  showParticipants = false;
  meetingParticipants: MeetingParticipant[] = [];
  numberOfParticipants = '';
  tileViewEnabled = false;
  raisedHand = false;
  chatIsOpen = false;
  isModerator = true;
  lobbyOn = false;
  meetingMembers: OonaUser[] = [];
  allUsers: OonaUser[] = [];
  userIsInvited = true;

  meetingName = '';
  inviteSuccessful = false;

  currentUser: OonaUser = {
    id: '',
    first_name: '',
    last_name: '',
    last_login: '',
    email: '',
    created_at: '',
  };

  meetingDetails: OonaMeeting = {
    agenda: '',
    attendees_name: [{ email: '', first_name: '', id: '', last_name: '' }],
    host_name: { email: '', first_name: '', id: '', last_name: '' },
    id: '',
    name: '',
    priority: 0,
    start_time: new Date(),
    stop_time: new Date(),
  };

  constructor(
    private router: Router,
    private conferenceService: ConferenceService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('Meeting response on iframe page', this.authService.meetingId);

    console.log('Domain url ===>>>', this.domain);
    this.room = this.authService.getCurrentMeetingId();
    this.user = this.authService.getCurrentUserName();
    if (!this.room) {
      this.route.params.subscribe((currentUrl: any) => {
        console.log('Current Params', currentUrl.id);
        const meetingId = currentUrl.id;
        this.conferenceService.getMeetingDetails(meetingId).subscribe(
          (meetingRes: any) => {
            console.log('User is invited to meeting');
            this.authService.saveCurrentMeetingId(currentUrl.id);
            this.room = currentUrl.id;
            this.userIsInvited = true;
          },
          (meetingErr: any) => {
            console.log('User is not invited to meeting');
            this.userIsInvited = false;
          }
        );
      });
    } else {
      this.route.params.subscribe((currentParams: Params) => {
        console.log('Url Params', currentParams.id);
        const meetingId = currentParams.id;
        this.conferenceService.getMeetingDetails(meetingId).subscribe(
          (meetingRes: any) => {
            console.log('User is invited to meeting');
            this.userIsInvited = true;
          },
          (meetingErr: any) => {
            console.log('User is not invited to meeting');
            this.userIsInvited = false;
          }
        );
      });
    }
  }

  toggleParticipantsView(): any {
    this.showParticipants = !this.showParticipants;
    this.numberOfParticipants = this.api.getNumberOfParticipants();
    this.getParticipants();
  }

  getCurrentUserDetails(): any {
    this.authService.getCurrentUser().subscribe(
      (currentUserRes: any) => {
        this.currentUser = currentUserRes.results[0];
      },
      (currentUserError: any) => {
        console.log('User error', currentUserError);
      }
    );
  }

  getMeetingDetails(): any {
    this.conferenceService.getMeetingDetails(this.room).subscribe(
      (meetingRes: any) => {
        this.meetingDetails = meetingRes;
        this.meetingMembers = meetingRes.attendees_name;
      },
      (meetingError: any) => {
        console.log('Get meeting details error', meetingError);
      }
    );
  }

  ngAfterViewInit(): void {
    this.options = {
      roomName: this.room,
      width: '100%',
      height: '100%',
      configOverwrite: {
        prejoinPageEnabled: false,
      },
      interfaceConfigOverwrite: {
        DEFAULT_LOGO_URL: '',
        SHOW_JITSI_WATERMARK: false,
      },
      parentNode: document.querySelector('#oona-iframe'),
      userInfo: {
        displayName: this.user,
      },
    };
    this.api = new JitsiMeetExternalAPI(this.domain, this.options);

    // Event handlers
    this.api.addEventListeners({
      readyToClose: this.handleClose,
      participantLeft: this.handleParticipantLeft,
      participantJoined: this.handleParticipantJoined,
      videoConferenceJoined: this.handleVideoConferenceJoined,
      videoConferenceLeft: this.handleVideoConferenceLeft,
      audioMuteStatusChanged: this.handleMuteStatus,
      videoMuteStatusChanged: this.handleVideoStatus,
      tileViewChanged: this.handleTileView,
      screenSharingStatusChanged: this.handleScreenSharingStatus,
      participantRoleChanged: this.handleRoleChanged,
    });

    this.api.isVideoMuted.then((available: any) => {
      console.log('Video Availability', available);
    });
  }
  // handleChat = async (chatStatus: any) => {
  //   console.log(chatStatus);
  //   if (chatStatus.isOpen === true) {
  //     this.chatIsOpen = true;
  //   } else if (chatStatus.isOpen === false) {
  //     this.chatIsOpen = false;
  //   }
  // }

  handleRoleChanged = async (newRole: any) => {
    this.isModerator = newRole.role === 'moderator';
  };

  handleTileView = async (tileViewStatus: any) => {
    if (tileViewStatus.enabled === true) {
      this.tileViewEnabled = true;
    } else {
      this.tileViewEnabled = false;
    }
  };

  handleScreenSharingStatus = async (screenSharingStatus: any) => {
    if (screenSharingStatus.on === true) {
      this.screenSharingOn = true;
    } else {
      this.screenSharingOn = false;
    }
  };

  handleClose = () => {
    console.log('handleClose');
  };

  handleParticipantLeft = async (participant: any) => {
    console.log('handleParticipantLeft', participant);
    // const data = await this.getParticipants();
  };

  handleParticipantJoined = async (participant: any) => {
    console.log('handleParticipantJoined', participant);
  }

  handleVideoConferenceJoined = async (participant: any) => {
    console.log('handleVideoConferenceJoined', participant);
  }

  handleVideoConferenceLeft = () => {
    console.log('handleVideoConferenceLeft');
    this.showParticipants = false;
  };

  handleMuteStatus = (audio: any) => {
    console.log('handleMuteStatus', audio);
    if (audio.muted === true) {
      this.isAudioMuted = true;
    } else {
      this.isAudioMuted = false;
    }
  };

  handleVideoStatus = (video: any) => {
    console.log('handleVideoStatus', video);
    if (video.muted === true) {
      this.isVideoMuted = true;
    } else {
      this.isVideoMuted = false;
    }
  };

  getParticipants(): any {
    this.meetingParticipants = this.api.getParticipantsInfo();
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(this.api.getParticipantsInfo());
    //   }, 500);
    // });
  }

  executeCommand(command: string): any {
    this.api.executeCommand(command);
    if (command === 'hangup') {
      this.showParticipants = false;
      this.api.dispose();
      this.authService.endCurrentMeeting();
      this.router.navigate(['/dashboard']);
    }
    if (command === 'toggleAudio') {
      this.isAudioMuted = !this.isAudioMuted;
    }
    if (command === 'toggleVideo') {
      this.isVideoMuted = !this.isVideoMuted;
    }
    if (command === 'startRecording') {
      this.isRecording = true;
    }
    if (command === 'stopRecording') {
      this.isRecording = false;
    }
    if (command === 'toggleRaiseHand') {
      this.raisedHand = !this.raisedHand;
    }
  }

  updateLobby(): any {
    if (this.isModerator && !this.lobbyOn) {
      this.api.executeCommand('toggleLobby', true);
    } else if (this.isModerator && this.lobbyOn) {
      this.api.executeCommand('toggleLobby', false);
    } else {
      return;
    }
    this.lobbyOn = !this.lobbyOn;
  }

  startRecording(command: string, {}): any {}
  openWhiteBoard(): any {
    window.open(
      env.whiteBoard + `/?whiteboardid=` + this.room,
      'Oona Whiteboard',
      'resizable=yes,width=800,height=600'
    );
  }
  openEtherpad(): any {
    window.open(
      env.etherPad +
        `p/` +
        this.room +
        `?userName=` +
        this.user.trim(),
      'Oona Pad',
      'resizable=yes,width=800,height=600'
    );
  }

  getCurrentMembers(): void {
    this.getMeetingDetails();

    this.conferenceService.getAllUsers().subscribe(
      (allUsersRes: any) => {
        this.allUsers = allUsersRes.results;
      },
      (allUsersErr: any) => {}
    );
  }

  removeMember(memberIndex: number): void {
    this.meetingMembers.splice(0, 1);
  }

  addSelectedUser(selectedUser: OonaUser): void {
    if (!this.meetingMembers.includes(selectedUser)) {
      this.meetingMembers.push(selectedUser);
    } else {
      return;
    }
  }

  inviteNewMembers(): void {
    const attendeesArray: string[] = [];
    this.meetingMembers.forEach((member: OonaUser) => {
      attendeesArray.push(member.id);
    });

    const meetingDetails = this.meetingDetails;
    const meetingData = {
      name: meetingDetails.name,
      start_time: meetingDetails.start_time,
      stop_time: meetingDetails.stop_time,
      priority: meetingDetails.priority,
      agenda: meetingDetails.agenda,
      host: meetingDetails.host_name.id,
      attendees: attendeesArray,
    };

    this.conferenceService
      .inviteMembers(meetingData, meetingDetails.id)
      .subscribe(
        (inviteMembersRes: any) => {
          this.inviteSuccessful = true;
          setTimeout(() => {
            this.inviteSuccessful = false;
          }, 5000);
        },
        (inviteMembersErr: any) => {
          console.log('Invite members array', inviteMembersErr);
        }
      );
  }

  ngOnDestroy(): void {
    this.showParticipants = false;
  }
}
