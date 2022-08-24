import { Component, Input, OnInit } from '@angular/core';
import { firmName } from '../../../../environments/environment';
// NgRx
import { Store } from '@ngrx/store';
import * as messagingActions from '../state/messaging.actions';
import { AppState } from '../../../state/app.state';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent implements OnInit {
  @Input() public users: any;

  constructor(private store: Store<AppState>) {}

  onIniHandler(): void {
  }

  ngOnInit(): void {
    this.onIniHandler();
  }
}
