import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {MessagingService} from '../../services/messaging.service';

// NgRx
import {Store} from '@ngrx/store';
import * as messageActions from '../../state/messaging.actions';
import {AppState} from '../../../../state/app.state';
import {getLoadingAllMsg, getAllMessages, getAllStreams} from '../../state/messaging.selectors';
import {Observable} from 'rxjs';
import {SingleChat, SingleMessageModel} from '../../models/messages.model';
import {getAllUsers} from "../../../../auth/state/auth.selectors";

@Component({
  selector: 'app-landing-message-board',
  templateUrl: './landing-message-board.component.html',
  styleUrls: ['./landing-message-board.component.scss']
})
export class LandingMessageBoardComponent implements OnInit {
  allTeams = Array();
  messagesOfStream = Array();
  initialMessageCount = 30;
  messages$!: Observable<any>;
  loadingMessages!: Observable<boolean>;
  messageExist: any;
  editorActive = true;
  editorChat: any;
  unreadCount = [];

  constructor(
    private messagingService: MessagingService,
    private change: ChangeDetectorRef,
    private store: Store<AppState>
  ) {
    this.allMemberTeams();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getMessagesOfTeams();
    }, 1000);
    this.initPage();
    // / get all private message
    this.getAllPrivateMessages();

    // stream messages
    this.getStreamMessage();
  }

  // Init Page
  initPage(): void {

    // get Loading Message
    this.loadingMessages = this.store.select(getLoadingAllMsg);

    // get messages from store
    this.messages$ = this.store.select(getAllMessages);

    this.messagesLength();
    // @ts-ignore
    document?.getElementById('box')?.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
  }

  messagesLength(): void {
    this.store.select(getAllMessages).subscribe(
      messages => {
        // @ts-ignore
        this.messageExist = messages?.length > 0;
      }
    );
  }

  getAllPrivateMessages(): void {
    this.store.select(getAllUsers).subscribe(users => {
      // console.log('All users fetched ===>>>>', users);

      users?.map((user: any) => {

        const streamDetail = {
          anchor: 'newest',
          num_before: 100,
          num_after: 0,
          type: [
            {
              operator: 'pm-with',
              operand: user?.email
            }
          ]
        };

        this.messagingService.getMessagesOfStream(streamDetail).subscribe(
          (response: any) => {
            // console.log('Getting messages from all users ===>>>', response);
            const messages = response?.zulip?.messages;

            messages?.forEach((msg: SingleMessageModel) => {
              if (msg) {
                // this.privateMessages.push(msg);
                // this.sortMessages();

                // console.log('Private messages ===>>>>', msg);
              }
            });

          }
        );
      });
    });
  }

  getStreamMessage(): void {
    this.store.select(getAllStreams).subscribe(streams => {
      // console.log('Stream details ===>>>>', streams);

      streams?.map((user: any) => {

        const streamDetail = {
          anchor: 'newest',
          num_before: 100,
          num_after: 0,
          type: [
            {
              operator: 'stream',
              operand: user?.name
            }
          ]
        };

        // console.log('streamDetail', streamDetail);

        this.messagingService.getMessagesOfStream(streamDetail).subscribe(
          (response: any) => {
            // console.log('Getting messages from all users ===>>>', response);
            const messages = response?.zulip?.messages;
            // console.log('stream messages ', messages?.length);

            const res = messages.reduce((x: any, cur: any) => {
              const item = cur.flags.includes('read');
              if (!x[item]) {
                x[item] = 0;
              }
              x[item] = x[item] + 1;
              return x;
            }, {});

            // tslint:disable-next-line:forin
            for (const key in res) {
              const count = res[key];
              const data = key.slice(0, 2);
              const service = key.slice(2);
              this.unreadCount.push({
                // @ts-ignore
                count
              });
            }
            console.log('The unread count ===>', this.unreadCount[1]);
            messages?.forEach((msg: SingleMessageModel) => {
              if (msg) {
                // this.privateMessages.push(msg);
                // this.sortMessages();
                if (msg.flags.includes('read')) {
                  console.log('returned');
                } else {
                  msg.flags.push('read');
                }

              }

            });


          }
        );
      });
    });
  }

  allMemberTeams(): void {
    this.messagingService.getAllTeams().subscribe((teams: any) => {
      this.allTeams = teams?.streams.map((team: { name: any; }) => team.name);
    });
  }

  getMessagesOfTeams(): void {
    // get messages of each team

    this.allTeams?.map((teamName: any) => {

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


      this.messagingService.getMessagesOfStream(streamDetail).subscribe((response: any) => {
          this.change.detectChanges();
          this.messagesOfStream.push(...response.zulip.messages);
          // sort by time. latest last
          this.messagesOfStream.sort((a, b) => a.timestamp - b.timestamp);
          this.change.detectChanges();

          // @ts-ignore
          document.getElementById('box').scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
        },
        (error: any) => {
          console.log('error', error);
        });
    });

  }

  getMorePrivateMessages(): void {
    this.initialMessageCount = this.initialMessageCount + 10;
    // get messages of each team
    this.allTeams?.map((teamName: any) => {
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
      this.messagingService.getMessagesOfStream(streamDetail).subscribe((response: any) => {
          this.change.detectChanges();
          // get first 10 items from this new array array.slice(0, 10);
          // add the 10 items to the top of the stack
          this.messagesOfStream.unshift(...response.zulip.messages.slice(0, 10));
          // sort by time. latest last
          // this.messagesOfStream.sort((a, b) =>  a.timestamp - b.timestamp );
          this.change.detectChanges();
        },
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
