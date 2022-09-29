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

  zulipUsers: ZulipSingleUser[] = [];
  zulipUsersSubject$ = new BehaviorSubject(this.zulipUsers);
  zulipUsersObservable = this.zulipUsersSubject$.asObservable();

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.initPage();
  }

  initPage(): void {
    setTimeout(() => {
      this.privateUnreadMessage();
    }, 1000);
    this.defaultUser();
  }

  defaultUser(): void {
    if (!this.userContent) {
      this.userContent = 'all_users';
    }
  }

  privateUnreadMessage(): void {
    const zulipUsers: ZulipSingleUser[] = [];
    const unique: number[] = [];

    this.allUsers$.subscribe(
      (users: ZulipSingleUser[]) => {
        users.map((user: ZulipSingleUser) => {

          this.store.select(getPrivateUnread).subscribe(
            (messages: SingleMessageModel[]) => {
              messages.map((message: SingleMessageModel) => {
                if (unique.includes(user.user_id)) { return; }
                if (+message.sender_id === +user.user_id) {
                  user.unread = user.unread ? user.unread += 1 : user.unread = 0;
                  console.log('Sender ==>>', user);
                  console.log('Message ===>>', message);
                }
                zulipUsers.push(user);
                this.zulipUsersSubject$.next(zulipUsers);
                unique.push(user.user_id);
              });
            }
          );

        });
      }
    );
  }

  rightPanelTypeListener($event: any): void {
    this.rightPanelEvent.emit('individual_user');
  }

}
