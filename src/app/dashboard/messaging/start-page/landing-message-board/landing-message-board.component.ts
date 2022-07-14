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
  editorActive = false;

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
    this.handleMsgGrouping();
  }

  handleMsgGrouping(): void {

    let timeStamps: any[] = [];

    const currentDate = new Date();
    const currentDay = currentDate;
    const currentMonth = currentDate.getMonth();

    console.log('Current day: ', currentDay);
    console.log('Current month: ', currentMonth);
    console.log('Current date: ', currentDate);

    this.store.select(getAllMessages).subscribe(
      messages => {
        messages?.map(mes => {

          const newDate = new Date();
          newDate.setTime(mes.timestamp * 1000);
          const dateString = newDate.toUTCString();

          const msgMonth = newDate.getMonth();
          timeStamps = [...timeStamps, dateString];

          // Todo add grouping messages

        });
        // console.log('Time stamp: ', timeStamps.sort((a: any, b: any) => a - b));
      }
    );


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
    console.log('Emit chat ===>>>', chat);
  }

}
