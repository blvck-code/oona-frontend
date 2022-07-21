import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import {getAllFilteredMsg, getAllMessages, getLoadingPrivateMsgs, getPrivateMessages} from '../../state/messaging.selectors';
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
  editorActive: boolean = false;

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
    console.log('Streams junior component loaded');
  }

  handleReply(message: any): void {
    this.editorActive = true;
    this.store.dispatch(new messageActions.HandleSendMessage(message));
  }

}
