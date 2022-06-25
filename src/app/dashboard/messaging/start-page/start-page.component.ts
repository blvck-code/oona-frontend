import { Component, OnInit } from '@angular/core';

// NgRx
import { Store } from '@ngrx/store';
import * as messagingActions from '../state/messaging.actions';
import {AppState} from '../../../state/app.state';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {

  constructor(
    private store: Store<AppState>
  ) { }

  onIniHandler(): void {
  }

  ngOnInit(): void {
    this.onIniHandler();
  }

}
