import { Component, OnInit } from '@angular/core';
// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../state/app.state';
import {getIsLoggedIn} from '../auth/state/auth.selectors';
// import * as messagingActions from ''

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = 'Team Messaging';
  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.store.select(getIsLoggedIn).subscribe({
      next: (status: boolean) => {
        console.log('Login status ==>>', status);
      },
      error: (error: any) => {
        console.log('Get login status error ==>>', error);
      }
    });
  }

  initializeState(): void {

  }

}
