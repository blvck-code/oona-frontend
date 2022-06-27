import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../state/app.state';
import {getAllFilteredMsg, getAllMessages} from '../../state/messaging.selectors';
import {SingleMessageModel} from '../../models/messages.model';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
  selector: 'app-streams-board',
  templateUrl: './streams-board.component.html',
  styleUrls: ['./streams-board.component.scss']
})
export class StreamsBoardComponent implements OnInit {
  streams$: Observable<any> | undefined;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
  }

  onInitHandler(): void {

    this.streams$ = this.store.select(getAllFilteredMsg)

  }

  ngOnInit(): void {
    this.onInitHandler();
  }

}
