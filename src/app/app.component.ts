import {Component, OnInit} from '@angular/core';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from './state/app.state';
import * as authActions from './auth/state/auth.actions';
import * as sharedActions from './shared/state/shared.actions';

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
    }
  }

  ngOnInit(): void {
    this.updateState();
    this.store.dispatch(new sharedActions.LoadUsers());
  }


}
