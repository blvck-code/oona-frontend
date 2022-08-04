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

  topicsId: any[] = [];
  @ViewChild('endChat') endChat: ElementRef | undefined;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
  }

  onInitHandler(): void {
    this.streams$ = this.store.select(getPrivateMessages);
    this.loading$ = this.store.select(getLoadingPrivateMsgs);
  }

  ngOnInit(): void {
    this.onInitHandler();
    this.getStreamData();
  }

  handleReply(message: any): void {
    this.editorActive = true;
    this.store.dispatch(new messageActions.HandleSendMessage(message));
  }

  getStreamData(): void {
    this.streams$ = this.store.select(getAllStreamData);
    this.store.select(getAllStreamData).subscribe(
      (response: SingleMessageModel[] | any) => {
        const topicMsg = response?.filter((msg: SingleMessageModel) => msg.stream_id === 10);


        setTimeout(() => {
          if (this.topicsId.includes(topicMsg?.id)) {
            return;
          }
          console.log('topicMsg ==>>>>', topicMsg)
          this.streamMsg.push(topicMsg);
          this.topicsId.push(topicMsg?.id);
        }, 1000);

        this.scrollBottom();
        console.log('Stream content ===>>>>', this.streamMsg)


      }
    );

    this.streamMsgObserver.subscribe(
      item => console.log('Item ===>>>', item)
    )
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
