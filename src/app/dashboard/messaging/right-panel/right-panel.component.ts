import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../state/app.state';
import {getPrivateUnread} from '../state/messaging.selectors';
import {SingleMessageModel} from '../models/messages.model';
import {ZulipSingleUser} from '../../../auth/models/user.model';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent implements OnInit {
  @Input() allUsers$!: Observable<any>;
  @Input() userContent!: string;
  @Output() rightPanelEvent = new EventEmitter<string>();

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.initPage();
  }

  initPage(): void {
    this.defaultUser();
  }

  defaultUser(): void {
    if (!this.userContent) {
      this.userContent = 'all_users';
    }
  }

  rightPanelTypeListener($event: any): void {
    this.rightPanelEvent.emit('individual_user');
  }

}
