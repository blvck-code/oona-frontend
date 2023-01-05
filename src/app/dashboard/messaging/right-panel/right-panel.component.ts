import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { getPrivateUnread } from '../state/messaging.selectors';
import { ZulipSingleUser } from '../../../auth/models/user.model';
import { ActivatedRoute } from '@angular/router';
import {
  privateMessagesLoaded,
  unreadMessages,
} from '../../state/entities/messages/private.messages.entity';
import { SingleMessageModel } from '../../models/messages.model';
import { getUsers, usersLoaded } from '../../state/entities/users.entity';
import { PersonModel } from '../../models/person.model';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss'],
})
export class RightPanelComponent implements OnInit {
  @Input() userContent!: string;
  @Output() rightPanelEvent = new EventEmitter<string>();
  allUsers$: Observable<any> = this.store.select(getUsers);

  users: PersonModel[] = [];
  usersSubject = new BehaviorSubject<PersonModel[]>(this.users);
  userObservable = this.usersSubject.asObservable();

  usersLoaded$: Observable<boolean> = this.store.select(usersLoaded);
  messagesLoaded$: Observable<boolean> = this.store.select(
    privateMessagesLoaded
  );
  unreadMessages$: Observable<SingleMessageModel[]> =
    this.store.select(unreadMessages);

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.initPage();
    this.allUsers$.subscribe({
      next: (users) => {
        this.usersSubject.next(users);
      },
    });
  }

  checkLoaded(): void {
    this.usersLoaded$.subscribe({
      next: (userLoaded) => {
        if (!userLoaded) {
          return;
        }

        this.messagesLoaded$.subscribe({
          next: (msgLoaded) => {
            if (!msgLoaded) {
              return;
            }

            this.handleUserUnread();
          },
        });
      },
    });
  }

  handleUserUnread(): void {
    this.unreadMessages$.subscribe({
      next: (messages) => {
        messages.map((message) => {
          if (message.type !== 'private') {
            return;
          }

          this.allUsers$.subscribe({
            next: (users) => {
              users.map((user: PersonModel) => {
                if (message.sender_id === user.user_id) {
                  this.usersSubject.subscribe({
                    // tslint:disable-next-line:no-shadowed-variable
                    next: (users) => {
                      // @ts-ignore
                      users = [...users, user];
                    },
                  });
                }
              });
            },
          });
        });
      },
    });
  }

  initPage(): void {
    this.defaultUser();
    this.checkLoaded();
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
