import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {MessagingService} from '../../services/messaging.service';
import {NotificationService} from '../../../../shared/services/notification.service';
import {Router} from '@angular/router';
import {Editor} from 'ngx-editor';
import {NgForm} from '@angular/forms';
import {GroupPmsServiceService} from '../../group-pms/group-pms-service.service';

import TurndownService from 'turndown';

const turndownService = new TurndownService();

@Component({
  selector: 'app-private-msg-text-editor',
  templateUrl: './private-msg-text-editor.component.html',
  styleUrls: ['./private-msg-text-editor.component.scss']
})
export class PrivateMsgTextEditorComponent implements OnInit, OnDestroy {
  @Output() messageContent = new EventEmitter<any>();
  @Output() newTopic = new EventEmitter<any>();
  editorTopic = '';
  values = '';
  // tslint:disable-next-line:max-line-length
  memberDetail: { is_admin: undefined; full_name: undefined; is_active: undefined; avatar_url: undefined; user_id: undefined; is_guest: undefined; bot_type: undefined; is_bot: undefined; email: undefined; } | undefined;
  userProfile: any;
  chatGroup = Array();
  allUsers = Array();
  filteredUsers = Array();
  constructor(
    private messagingService: MessagingService,
    private  groupPmsService: GroupPmsServiceService,
    private  notificationService: NotificationService,
    private router: Router,
  ) { }

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

  ngOnInit(): void {
    this.loggedInProfile();
    this.editor = new Editor();
    this.editor.commands.focus().exec();
    this.groupPmsService.currentChatGroup.subscribe((chatMembers) => {
      this.chatGroup = chatMembers;
    });
    this.messagingService.getUsersByAvailability().subscribe((users: { members: any[]; }) => {

      this.allUsers = users.members.filter(user => user.presence );
    });
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
    if (this.chatGroup.length < 1){
      this.notificationService.showWarning(`Please select a group to chat with`, 'Group members not selected');
      return;
    }
    const meetingMembers = this.chatGroup.filter(member => member.email !== this.userProfile.email);

    // check if all members are part of oona then create a meeting to include all members
    meetingMembers.forEach(member => {
      this.messagingService.getOonaMemberDetail(member.email).subscribe((oonaMemberProfile: any) => {
        if (oonaMemberProfile.results.length < 1){
          this.notificationService.showWarning(`${member.full_name} is not a member of oona`, 'Not a member of oona');
          return;
        }else{
          meetingAttendees.push(oonaMemberProfile.results[0].id);
        }
      });
    });

    setTimeout(() => {
      if (meetingAttendees.length > 1){
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
    console.log('Form data ==>>', form);
    const markdown = turndownService.turndown(form.value.name);
    const messageDetail = {
      to: this.chatGroup.map(member => member.id),
      content: markdown
    };
    this.messagingService.sendIndividualMessage(messageDetail).subscribe((response: any) => {
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

  handleSelection(event: any): void {
    this.editorData += ' ' + event.char;
  }
}
