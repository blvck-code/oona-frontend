import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {MessagingService} from '../../services/messaging.service';

// NgRx
import {Store} from '@ngrx/store';
import * as messageActions from '../../state/messaging.actions';
import { AppState } from '../../../../state/app.state';
import {getLoadingAllMsg, getAllMessages, getPrivateMessages} from '../../state/messaging.selectors';
import {Observable} from 'rxjs';
import {SingleChat, SingleMessageModel} from '../../models/messages.model';

@Component({
  selector: 'app-landing-message-board',
  templateUrl: './landing-message-board.component.html',
  styleUrls: ['./landing-message-board.component.scss']
})
export class LandingMessageBoardComponent implements OnInit {
  allTeams = Array();
  messagesOfStream = Array();
  initialMessageCount =  30;
  messages$!: Observable<any>;
  loadingMessages!: Observable<boolean>;
  messageExist: any;
  editorActive = true;
  editorChat: any;

  constructor(
    private messagingService: MessagingService,
    private change: ChangeDetectorRef,
    private store: Store<AppState>
  ) {
    this.allMemberTeams();
  }

  ngOnInit(): void {
    setTimeout( () => {this.getMessagesOfTeams(); }, 1000);
    this.initPage();
  }

  handleMsgGrouping(): void {
    // This sample uses a fixed date so the categories can be illustrated better:
    const currentDate = new Date(); // Or leave out the argument for actual date
    currentDate.setHours(0, 0, 0, 0); // set to midnight
// Prepare all related dates: yesterday and last Monday
    const keys: any = [];
    keys.push(['Today', new Date(currentDate)]); // clone
    currentDate.setDate(currentDate.getDate() - 1);
    keys.push(['Yesterday', new Date(currentDate)]); // clone
    currentDate.setDate(currentDate.getDate() - (currentDate.getDay() + 6) % 7);
    keys.push(['This Week', new Date(currentDate)]); // clone

    const messages = [
      { date: '2022/07/09' },
      { date: '2022/07/10' },
      { date: '2022/07/11' },
      { date: '2022/07/12' },
      { date: '2022/07/13' },
      { date: '2022/07/14' }, // Monday
      { date: '2022/07/15' },
    ];

    const messageTypeList = {
      Today: [],
      Yesterday: [],
      'This Week': []
    };

    messages.forEach( message => {
      const date = message.date.substring(0, 10).replace(/-/g, '\/');
      const messageDate = new Date(date);

      // tslint:disable-next-line:no-shadowed-variable
      const key = keys?.find(([key, date]: any) => messageDate >= date ) || [];

      // messageTypeList.push(message);
    });

    // this.store.select(getAllMessages).subscribe(
    //   messages => {
    //     messages?.map((message, index) => {
    //
    //       const messageDate = new Date();
    //       messageDate.setTime(message.timestamp * 1000);
    //
    //       const [key] = keys.find(([key, date]) => messageDate >= date) || [];
    //       if (key) {
    //         // @ts-ignore
    //         this.messageTypeList[key].push(message);
    //       }
    //
    //       // Todo add grouping messages
    //       console.log('Message types list', this.messageTypeList);
    //
    //     });
    //     // console.log('Time stamp: ', timeStamps.sort((a: any, b: any) => a - b));
    //   }
    // );


  }

  // Init Page
  initPage(): void {

      // const streamDetail = {
      //   use_first_unread_anchor: true,
      //   num_before: this.initialMessageCount,
      //   type: [
      //     {
      //       operator: 'stream',
      //       operand: 'general'
      //     }
      //   ]
      // };

    // fetch data from server
    //   this.store.dispatch(new messageActions.LoadMessaging(streamDetail));

      // get Loading Message
      this.loadingMessages = this.store.select(getLoadingAllMsg);

      // get messages from store
      this.messages$ = this.store.select(getAllMessages);

      this.messagesLength();
      // @ts-ignore
      document?.getElementById('box')?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  }

  messagesLength(): void {
    this.store.select(getAllMessages).subscribe(
      messages => {
        // @ts-ignore
        this.messageExist = messages?.length > 0;
      }
    );
  }

  allMemberTeams(): void{
    this.messagingService.getAllTeams().subscribe((teams: any) => {
      this.allTeams = teams.streams.map((team: { name: any; }) => team.name);
    });
  }

  getMessagesOfTeams(): void{
    // get messages of each team
    this.allTeams.forEach( (teamName: any) => {

      const streamDetail = {
        use_first_unread_anchor: true,
        num_before: this.initialMessageCount,
        type: [
          {
            operator: 'stream',
            operand: teamName
          }
        ]
      };

      this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
        this.change.detectChanges();
        this.messagesOfStream.push(...response.zulip.messages);
        // sort by time. latest last
        this.messagesOfStream.sort((a, b) =>  a.timestamp - b.timestamp );
        this.change.detectChanges();

          // @ts-ignore
        document.getElementById('box').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        } ,
        (error: any) => {
          console.log('error', error);
        });
    });

  }

  getMorePrivateMessages(): void {
    this.initialMessageCount = this.initialMessageCount + 10;
    // get messages of each team
    this.allTeams.forEach( (teamName: any) => {
      const streamDetail = {
        use_first_unread_anchor: true,
        num_before: this.initialMessageCount,
        type: [
          {
            operator: 'stream',
            operand: teamName
          }
        ]
      };
      this.messagingService.getMessagesOfStream(streamDetail).subscribe( (response: any) => {
          this.change.detectChanges();
          // get first 10 items from this new array array.slice(0, 10);
          // add the 10 items to the top of the stack
          this.messagesOfStream.unshift(...response.zulip.messages.slice(0, 10));
          // sort by time. latest last
          // this.messagesOfStream.sort((a, b) =>  a.timestamp - b.timestamp );
          this.change.detectChanges();
        } ,
        (error: any) => {
          console.log('error', error);
        });
    });
  }

  selectedChat(chat: SingleChat): any {
    this.editorActive = true;
    this.store.dispatch(new messageActions.HandleSendMessage(chat));
    this.editorChat = chat;
    console.log('Emit chat ===>>>', chat);
  }

}
