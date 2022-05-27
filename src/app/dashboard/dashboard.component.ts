import { Component, OnInit } from '@angular/core';
// NgRx
import * as sharedAction from '../shared/state/shared.actions';
import {Store} from '@ngrx/store';
import {AppState} from '../state/app.state';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.initOnLoad();
  }

  initOnLoad() {
    this.store.dispatch(new sharedAction.LoadUsers());
  }

}
