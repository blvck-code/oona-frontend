import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../state/app.state';
import {
  getPrivateUnread,
  getPrivateUser,
} from '../../../state/messaging.selectors';
import { SingleMessageModel } from '../../../models/messages.model';
import { PersonModel } from '../../../../models/person.model';
import { currentUser } from '../../../../state/entities/users.entity';
import { unreadMessages } from '../../../../state/entities/messages/private.messages.entity';

@Component({
  selector: 'app-individual-user-panel',
  templateUrl: './individual-user-panel.component.html',
  styleUrls: ['./individual-user-panel.component.scss'],
})
export class IndividualUserPanelComponent implements OnInit {
  @Input() users$!: Observable<PersonModel[]>;
  searchText = '';
  showSearchUser = false;
  currentUser: any;
  staffUsers: PersonModel[] = [];
  unreadMessagesId: number[] = [];

  currentUser$: Observable<PersonModel | undefined> =
    this.store.select(currentUser);
  // @ts-ignore
  unreadMessages$: Observable<SingleMessageModel[]> =
    this.store.select(unreadMessages);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.onInitHandler();
  }

  onInitHandler(): void {
    this.routerDetails();
    this.unreadMessages();
  }

  routerDetails(): void {
    this.route.queryParams.subscribe((params) => {
      const userId = params.id;
      this.users$.subscribe((users: PersonModel[]) => {
        users.map((user: PersonModel) => {
          if (user.user_id === +userId) {
            this.currentUser = user;
          }
        });
        this.users$.subscribe((staffUsers: PersonModel[]) => {
          this.staffUsers = staffUsers.filter(
            (user) => user.user_id !== +userId
          );
        });
      });
    });
  }

  unreadMessages(): void {
    this.unreadMessages$.subscribe((messages: SingleMessageModel[]) => {
      messages.map((message: SingleMessageModel) => {
        if (this.unreadMessagesId.includes(message.sender_id)) {
          return;
        }
        this.unreadMessagesId.push(message.sender_id);
      });
    });
  }

  rightPanelTypeListener(member: PersonModel): void {
    const index = this.unreadMessagesId.indexOf(member.user_id);
    this.unreadMessagesId.splice(index);
    this.router.navigate(['dashboard/messaging/narrow'], {
      queryParams: {
        id: member.user_id,
        member: member.full_name.replace(/\s/g, ''),
      },
    });
  }

  handleShowSearchUser(): void {
    this.showSearchUser = !this.showSearchUser;
  }
}
