import {Component, OnInit} from '@angular/core';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from './state/app.state';
import * as authActions from './auth/state/auth.actions';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'oona';

  constructor(
    private store: Store<AppState>,
  ) {
  }

  updateState = () => {
    if (localStorage.getItem('accessToken')){
      console.log('User token exists');
      this.store.dispatch(new authActions.UpdateState());
    }
  }

  ngOnInit(): void {
    this.store.dispatch(new authActions.LoadAllUsers());
    this.updateState();
  }

}
