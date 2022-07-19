import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MessagingService } from '../messaging/services/messaging.service';
import {NotificationService} from '../../shared/services/notification.service';
import {Router} from '@angular/router';
import {Editor} from 'ngx-editor';
import {NgForm} from '@angular/forms';

import TurndownService from 'turndown';
import {GroupPmsServiceService} from '../messaging/group-pms/group-pms-service.service';
import {Observable} from 'rxjs';
import {AppState} from '../../state/app.state';
import {Store} from '@ngrx/store';
import {getAllStreams, getReceiverInfo} from '../messaging/state/messaging.selectors';
import { SingleChat } from '../messaging/models/messages.model';
import {messageChannel} from '../../../environments/environment';
import {MessagesSocketService} from '../messaging/services/messages-socket.service';

const turndownService = new TurndownService();

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {
  @Output() messageContent = new EventEmitter<any>();
  @Output() newTopic = new EventEmitter<any>();
  @Input() activeChat: any;
  editorTopic = '';
  values = '';
  currentForm = 'general';
  // tslint:disable-next-line:max-line-length
  memberDetail: { is_admin: undefined; full_name: undefined; is_active: undefined; avatar_url: undefined; user_id: undefined; is_guest: undefined; bot_type: undefined; is_bot: undefined; email: undefined; } | undefined;
  userProfile: any;
  chatGroup = Array();
  allUsers = Array();
  streams = Array();
  filteredStreams = Array();
  filteredUsers = Array();
  receiverInfo!: SingleChat | any;
  activeEditor = false;

  searchStreamTerm = '';
  recipientUser = '';
  defaultStream = '';

  constructor(
    private messagingService: MessagingService,
    private  groupPmsService: GroupPmsServiceService,
    private  notificationService: NotificationService,
    private router: Router,
    private store: Store<AppState>,
    private msgSocket: MessagesSocketService,
  ) {
    this.messagingService.messages.subscribe(msg => {
      console.log('Response from websocket from server ===>>>', msg);
    });
    console.log('activeChat: ', this.activeChat);
  }

  // @ts-ignore
  editor: Editor;

  public tools: object = {
    items: ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'OrderedList',
      'UnorderedList', '|', 'CreateLink', '|', 'SourceCode',
      {
        tooltipText: 'Share video link',
        undo: true,
        click: this.onClick.bind(this),
        template: '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%">'
          + '<div class="e-tbar-btn-text" style="font-weight: 500;"><i class="bi bi-camera-video"></i></div></button>'
      }, '|', 'Undo', 'Redo'
    ]
  };
  html: '' = '';

  editorData = '';
  toggled = false;

  getReceiverInfo(): void {
    this.receiverInfo = '';
    this.store.select(getReceiverInfo).subscribe(
      (data: SingleChat) => {
        this.receiverInfo = data;
        console.log('Receiver data: ', data);

        if (data?.subject) {
          this.defaultStream = `${data?.display_recipient} > ${data?.subject}`;
        } else {
          this.defaultStream = `${data?.display_recipient}`;
        }
      }
    );
  }

  // get streams
  getStreams(): void {
    // TODO change to last message in the chat
    this.store.select(getAllStreams).subscribe(
      streams => {
        this.streams = streams;
        const length = streams?.length;
        const lastStream = streams[length - 1];

        this.defaultStream = lastStream?.name;
      }
    );
    // this.handleDefaultStream();
  }

  handleDefaultStream(): void {
    console.log('Getting length');
    setTimeout(() => {
      console.log('Streams: ', this.streams);
    }, 1000);

    if (this.streams.length){
      console.log('Length: ', this.streams.length);

    }
  }

  onInitHandler(): void {
    this.loggedInProfile();
    this.getReceiverInfo();
    this.getStreams();
    this.editor = new Editor();
    this.editor.commands.focus().exec();
    this.groupPmsService.currentChatGroup.subscribe((chatMembers) => {
      this.chatGroup = chatMembers;
    });
    this.messagingService.getUsersByAvailability().subscribe((users: { members: any[]; }) => {

      this.allUsers = users.members.filter(user => user.presence );
    });
  }

  ngOnInit(): void {
    this.onInitHandler();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  loggedInProfile(): void{
    this.messagingService.oonaProfile().subscribe((profile: any) => {
      this.userProfile = profile.results[0];
    });
  }

  public onClick(): any {
    const currentUrl = window.location.href;
    const meetingAttendees: any[] = [];
    if (this.chatGroup.length < 1) {
      this.notificationService.showWarning(`Please select a group to chat with`, 'Group members not selected');
      return;
    }
    const meetingMembers = this.chatGroup.filter(member => member.email !== this.userProfile.email);

    // check if all members are part of oona then create a meeting to include all members
    meetingMembers.forEach(member => {
      this.messagingService.getOonaMemberDetail(member.email).subscribe((oonaMemberProfile: any) => {
        if (oonaMemberProfile.results.length < 1) {
          this.notificationService.showWarning(`${member.full_name} is not a member of oona`, 'Not a member of oona');
          return;
        } else {
          meetingAttendees.push(oonaMemberProfile.results[0].id);
        }
      });
    });
    setTimeout(() => {
      if (meetingAttendees.length > 1) {
        this.newMeeting(meetingAttendees);
      }
    }, 1000);
  }

  newMeeting(memberIds: any): any {
    const currentDate = new Date ();
    const startTimeTimestamp = currentDate.setMinutes(currentDate.getMinutes() + 5);
    const stopTimeTimestamp = new Date(startTimeTimestamp);


    // console.log('start time', this.formatDate(new Date(startTimeTimestamp)));
    // console.log('stop time', this.formatDate(new Date( stopTimeTimestamp.getTime() + 30 * 60000)));
    const meetingDetail = {
      name: `New group meeting ${this.formatDate(new Date(startTimeTimestamp))}`,
      start_time: this.formatDate(new Date(startTimeTimestamp)),
      stop_time:  this.formatDate(new Date( stopTimeTimestamp.getTime() + 30 * 60000)),
      priority: '2',
      attendees: memberIds
    };

    this.messagingService.createMeeting(meetingDetail).subscribe((response: any) => {
      this.notificationService.showInfo('Your meeting has been created. Go back to the meeting page to view', 'Meeting created');
      setTimeout(() => {
        this.router.navigate(['dashboard']);
      }, 1000);

    });
  }

  formatDate(dateObject: any): any{
    const cDate = dateObject.getFullYear() + '-' + (dateObject.getMonth() + 1) + '-' + dateObject.getDate();
    const cTime = dateObject.getHours() + ':' + dateObject.getMinutes() + ':' + dateObject.getSeconds();
    const dateTime = cDate + ' ' + cTime;
    return dateTime;
  }

  onSubmit(form: NgForm): void {
    const markdown = turndownService.turndown(form.value.name);

    console.log('receiverInfo: ', this.receiverInfo);

    if (this.currentForm === 'general') {

      const messageDetails = {
        to: this.currentForm,
        // ToDo change this to user message id
        topic: this.receiverInfo?.subject,
        content: markdown
      };

      console.log('Message details: ', messageDetails);
    }

    const messageDetail = {
      // to: this.receiverInfo.display_recipient,
      // ToDo change this to user message id
      topic: 60,
      content: markdown
    };

    // const messageDetail = {
    //   to: this.chatGroup.map(member => member.id),
    //   topic: '',
    //   content: markdown
    // };

    // console.log('messageDetail ====>>>', messageDetail);

    // const message = {
    //   author: 'Oluoch',
    //   message: 'trial message'
    // };

    // this.msgSocket.messages.next(message);

    // console.log('Message content ===>>>', messageChannel);

    this.messagingService.sendStreamMessage(messageDetail).subscribe((response: any) => {
      if (response.zulip.result === 'success'){
        // clear the form
        form.value.name = '';
        this.editorData = '';
      }
    });
    // clear the form
    form.value.name = '';
    this.editorData = '';
  }

  onKey(event: any): any {
    this.newTopic.emit(event.target.value);
  }

  removeFromGroup(person: any): void {
    this.chatGroup = this.chatGroup.filter(item => item !== person);
    this.groupPmsService.changeChatGroup(this.chatGroup);
  }

  addSelectedUser(user: any): any {
    this.chatGroup.push(user);
    const uniqueMembers = [...new Set(this.chatGroup)];
    this.groupPmsService.changeChatGroup(uniqueMembers);
  }

  searchUser(event: any): any {
    if (event.target.value === '') {
      return this.filteredUsers = [];
    }
    // tslint:disable-next-line:max-line-length
    this.filteredUsers = this.allUsers.filter(user => user.full_name.toLowerCase().includes(event.target.value.toLowerCase()) || user.email.toLowerCase().includes(event.target.value.toLowerCase()));

  }

  searchStream(event: any): any {
    const searchTerm = event.target.value;
    if (searchTerm === '') {
      return this.filteredStreams = [];
    }
    // tslint:disable-next-line:max-line-length
    this.filteredStreams = this.streams?.filter(stream => stream.name.toLowerCase().includes(searchTerm.toLowerCase()));

  }

  handleSelection(event: any): void {
    this.editorData += ' ' + event.char;
  }

  addSelectedStream(stream: any): void {
    this.searchStreamTerm = stream.name;
  }

  handleShowTopic(type: string): void {
    this.currentForm = type;
    this.activeEditor = true;
  }

  resetEditor(): void {
    this.currentForm = 'general';
    this.activeEditor = false;
  }
}
