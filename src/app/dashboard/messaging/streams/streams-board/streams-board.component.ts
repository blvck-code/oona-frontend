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

  selectedStreamId = 1;
  selectedStreamIdSubject = new BehaviorSubject<number>(+this.selectedStreamId);
  selectedStreamIdObservable = this.selectedStreamIdSubject.asObservable();

  dateSortedPrivateMessages: any[] = [];


  topicsId: any[] = [];
  @ViewChild('endChat') endChat: ElementRef | undefined;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.activateRoute.paramMap.subscribe((event: any) => {
      const streamId = event?.get('stream')?.split('-')[0];
      const topicInfo = event?.get('topic')?.replace('-', ' ');
      this.selectedStreamId = streamId;
    });
  }

  onInitHandler(): void {
    this.streams$ = this.store.select(getPrivateMessages);
    this.loading$ = this.store.select(getLoadingPrivateMsgs);
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


    this.streamMsgObserver.subscribe(
      item => console.log('Item ===>>>', item)
    );
  }

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
