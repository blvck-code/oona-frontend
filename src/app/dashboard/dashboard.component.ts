import { Component, OnInit } from '@angular/core';
// NgRx
import * as authActions from '../auth/state/auth.actions';
import {Store} from '@ngrx/store';
import {AppState} from '../state/app.state';
import {getToken} from 'codelyzer/angular/styles/cssLexer';
import {getIsLoggedIn} from '../auth/state/auth.selectors';

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
    // this.initOnLoad();
  }

}
