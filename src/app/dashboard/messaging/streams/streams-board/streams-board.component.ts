import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import {
  getAllFilteredMsg,
  getAllMessages,
  getAllStreamData,
  getLoadingPrivateMsgs,
  getPrivateMessages
} from '../../state/messaging.selectors';
import {SingleMessageModel} from '../../models/messages.model';
import {BehaviorSubject, Observable} from 'rxjs';
import * as messageActions from '../../state/messaging.actions';
import {getSelectedUser} from '../../../../auth/state/auth.selectors';
import {OonaSocketService} from '../../services/oona-socket.service';

@Component({
  selector: 'app-streams-board',
  templateUrl: './streams-board.component.html',
  styleUrls: ['./streams-board.component.scss']
})
export class StreamsBoardComponent implements OnInit {
  streams$: Observable<any> | undefined;
  loading$!: Observable<boolean>;
  editorActive = false;

  streamMsg: any[] = [];
  streamMsgSubject = new BehaviorSubject<SingleMessageModel[]>(this.streamMsg);
  streamMsgObserver = this.streamMsgSubject.asObservable();

  selectedStreamId: any;
  selectedTopicName = '';

  dateSortedPrivateMessages: any[] = [];


  messagesId: number[] = [];

  @ViewChild('endChat') endChat: ElementRef | undefined;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private oonaSocket: OonaSocketService
  ) {
    this.activateRoute.paramMap.subscribe((event: any) => {
      const streamId = event?.get('stream')?.split('-')[0];
      const topicInfo = event?.get('topic')?.replace(/-/g, ' ');

      this.selectedStreamId = streamId;
      if (topicInfo) {
        this.selectedTopicName = topicInfo;
      }

    });
  }

  onInitHandler(): void {
    this.streams$ = this.store.select(getPrivateMessages);
    this.loading$ = this.store.select(getLoadingPrivateMsgs);
    this.inComingMessage();
  }

  ngOnInit(): void {
    this.onInitHandler();
    this.getStreamData();
    this.handleRouterChange();
  }

  handleRouterChange(): void {
    // @ts-ignore
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.getStreamData();
      }
    });
  }

  handleReply(message: any): void {
    this.editorActive = true;
    this.store.dispatch(new messageActions.HandleSendMessage(message));
  }

  getStreamData(): void {
    this.streams$ = this.store.select(getAllStreamData);
    this.store.select(getAllStreamData).subscribe(
      (response: SingleMessageModel[] | any) => {
        response?.map(
          (content: SingleMessageModel) => {

            if (this.selectedTopicName) {
              console.log('Selected stream topic ===>>', this.selectedTopicName);
              const filteredTopics = response.find((streamData: SingleMessageModel) =>
                streamData.subject.toLowerCase() === this.selectedTopicName
              );

              console.log('Filtered stream content ===>>>>', filteredTopics);
              this.streamMsg.push(filteredTopics);

            }



            if (+content.stream_id === +this.selectedStreamId) {
              this.streamMsg.push(content);
              this.sortMessages();
            } else {
              this.streamMsg = [];
            }

          }
        );
        this.scrollBottom();
      }
    );
  }

  inComingMessage(): void {
    this.oonaSocket.streamMessageCountSocket.subscribe(
      streamData => {
        streamData?.map((newMessage: SingleMessageModel) => {

          if (+newMessage.stream_id === +this.selectedStreamId) {

            if (this.messagesId.includes(+newMessage.id)){
              return;
            }

            console.log('New message content ===>>>', newMessage);
            this.streamMsg = [...this.dateSortedPrivateMessages, newMessage];
            this.messagesId.push(newMessage.id);
            this.sortMessages();
            this.scrollBottom();
          }

        });
      }
    );
  }

  // outGoingMsg(): void{
  //   this.oonaSocket.myMessagesSocketSubject.subscribe(
  //     (msg: any) => {
  //
  //       console.log('My sent outgoing message content ===>>>', msg);
  //
  //       this.privateMessagesSubject.subscribe( messages => {
  //
  //           console.log('Private messages content ===>>>', messages);
  //
  //           if (this.messagesId.includes(msg.id)){
  //             return;
  //           }
  //
  //           if (!msg.id){
  //             return;
  //           }
  //
  //           this.messagesId.push(msg.id);
  //           this.dateSortedPrivateMessages.push(msg);
  //         }
  //       );
  //
  //     }
  //   );
  // }

  sortMessages(): void{
    this.dateSortedPrivateMessages = this.streamMsg.sort((a, b ) => a.timestamp - b.timestamp);
    this.scrollBottom();
  }

  scrollBottom(): any {
    if (this.endChat) {
      setTimeout(() => {
        // @ts-ignore
        this.endChat.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest'});
      }, 500);
    }
  }

}
