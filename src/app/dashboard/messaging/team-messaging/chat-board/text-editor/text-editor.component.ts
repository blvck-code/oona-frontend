import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Editor, Toolbar, Validators, toHTML } from 'ngx-editor';
import {
  FormControl,
  FormGroup,
  NgForm,
} from '@angular/forms';
import { MessagingService } from '../../../services/messaging.service';
import {NotificationService} from '../../../../../shared/services/notification.service';
import {Router} from '@angular/router';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import {ChatBoardService} from '../chat-board.service';
import {Store} from "@ngrx/store";
import {AppState} from "../../../../../state/app.state";
import {getSelectedTopic} from "../../../state/messaging.selectors";

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class TextEditorComponent implements OnInit, OnDestroy {
  @Output() messageContent = new EventEmitter<any>();
  @Output() newTopic = new EventEmitter<any>();
  @Output() streamFile = new EventEmitter<any>();

  @Input() messageTopic: any;
  @Input() streamName: any;
  currentTopic = '';
  editorTopic = '';
  values = '';
  memberDetail =  {
    is_admin: undefined,
    full_name: undefined,
    is_active: undefined,
    avatar_url: undefined,
    user_id: undefined,
    is_guest: undefined,
    bot_type: undefined,
    is_bot: undefined,
    email: undefined
  };
  userProfile: any;

  constructor(
    private messagingService: MessagingService,
    private chatBoardService: ChatBoardService,
    private  notificationService: NotificationService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  // @ts-ignore
  editor: Editor;
  // @ts-ignore
  selectedFile: File;
  // @ts-ignore
  imageSrc: string;
  // @ts-ignore
  public newFileGroup: FormGroup;

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

  insertImageSettings = {
    saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
    removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
    width: 200,
    height: 200
  };
  html: '' = '';

  editorData = '';
  htmlContent: any;
  updatedTopic: any;
  toggled = false;

  ngOnInit(): void {
    this.messagingService.currentEditorTopic.subscribe((editorTopic) => {
      this.editorTopic = editorTopic; // always get the current value
    });
    this.messagingService.currentMemberChatDetail.subscribe(member => {
      this.memberDetail = member;
    });
    this.loggedInProfile();
    this.editor = new Editor();
    this.editor.commands.focus().exec();

    this.newFileGroup = new FormGroup({
      selectedFile: new FormControl(this.selectedFile),
    });

    this.store.select(getSelectedTopic).subscribe(
      (topicName:string) => {
        if (topicName) {
          this.currentTopic = topicName;
        } else {
          this.currentTopic = 'new streams'
        }
      }
    )
  }

  onFileChanged(event: any): void {
    const reader = new FileReader();
    this.selectedFile = event.target.files[0];
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.imageSrc = reader.result as string;
    };
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
    // console.log('current url', currentUrl);
    if (currentUrl.includes('member')){
      this.messagingService.getOonaMemberDetail(this.memberDetail?.email).subscribe((oonaProfileData: { results: string | any[]; }) => {
        if (oonaProfileData.results.length < 1){
          this.notificationService.showWarning(`${this.memberDetail?.full_name} is not a member of oona`, 'Not a member of oona');
          return;
        }else{
          this.newMeeting([oonaProfileData.results[0].id]);
        }
      });
    }

  }

  shareFile(): void{
    // check current url and send file to appropriate individual or stream
    const currentPath = window.location.href;
    if (currentPath.includes('member')){
      // send file to individual
      this.sendFileToIndividual();
    }else if (currentPath.includes('team')){
      this.sendFileToStream();
    }
  }

  sendFileToStream(): void{
    const newFileItem = new FormData();
    newFileItem.append('to', this.streamName);
    newFileItem.append('file', this.selectedFile);
    newFileItem.append('content', '&npsp');
    newFileItem.append('topic', this.messageTopic);
    this.messagingService.sendStreamMessageWithFile(newFileItem).subscribe((res: any) => {
        if (res.zulip.result === 'success'){
          this.editorData += res.oz.file;
        }
      });
  }

  private sendFileToIndividual(): void {
    const newFileItem = new FormData();
    // @ts-ignore
    newFileItem.append('to', this.memberDetail.user_id);
    newFileItem.append('file', this.selectedFile);
    newFileItem.append('content', '&npsp');
    this.messagingService.sendIndividualMessageWithFile(newFileItem).subscribe((res: any) => {
      if (res.zulip.result === 'success'){
        this.editorData += res.oz.file;
      }
    });
  }

  newMeeting(memberIds: any): any {
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
      attendees: memberIds
    };

    console.log(meetingDetail);
    this.messagingService.createMeeting(meetingDetail).subscribe((response: any) => {
      // response.video_stream
      // https://192.168.0.76:8443/67830bfd-7249-4d05-b5a6-5eda9c0c30fa
      this.notificationService.showInfo('Your meeting has been created. Go back to the meeting page to view', 'Meeting created');
      setTimeout(() => {
        this.router.navigate(['dashboard']);
      }, 1000);

    });
  }


  onSubmit(form: NgForm): void {
    console.log('Message content ===>>>', form);
    this.messageContent.emit(form.value.name);
    // clear the form
    form.value.name = '';
    this.editorData = '';
  }

  onKey(event: any): any {
    this.newTopic.emit(event.target.value);
  }

  handleSelection(event: any): void {
    // const newData = this.editorData.replace(/\n$/, '') + ' ' + event.char.replace(/[\n\r]+/g, ' ');
    this.editorData += ' ' + event.char;
  }
}
