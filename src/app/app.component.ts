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
      this.store.dispatch(new authActions.UpdateState());
      this.store.dispatch(new authActions.LoadProfile());
    }
  }

  ngOnInit() {
    this.updateState();
  }


}
