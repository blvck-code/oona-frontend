import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ZulipSingleUser} from '../../../../../auth/models/user.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../state/app.state';
import {getPrivateUnread, getPrivateUser} from '../../../state/messaging.selectors';
import {SingleMessageModel} from '../../../models/messages.model';

@Component({
  selector: 'app-individual-user-panel',
  templateUrl: './individual-user-panel.component.html',
  styleUrls: ['./individual-user-panel.component.scss']
})
export class IndividualUserPanelComponent implements OnInit {
  @Input() users$!: Observable<ZulipSingleUser[]>;
  searchText = '';
  showSearchUser = false;
  currentUser: any;
  staffUsers: ZulipSingleUser[] = [];
  unreadMessagesId: number[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
  }

  ngOnInit(): void {
    this.onInitHandler();
  }

  onInitHandler(): void {
    this.routerDetails();
    this.unreadMessages();
  }

  routerDetails(): void {
    this.route.queryParams.subscribe(params => {
      const userId = params.id;
      this.users$.subscribe(
        (users: ZulipSingleUser[]) => {
          users.map(
            (user: ZulipSingleUser) => {
              if (user.user_id === +userId) {
                this.currentUser = user;
              }
            }
          );
          this.users$.subscribe(
            (staffUsers: ZulipSingleUser[]) => {
              this.staffUsers = staffUsers.filter(user => user.user_id !== +userId);
            }
          );
        }
      );
    });
  }

  unreadMessages(): void {
    this.store.select(getPrivateUnread).subscribe(
      (messages: SingleMessageModel[]) => {
        messages.map((message: SingleMessageModel) => {
          if (this.unreadMessagesId.includes(message.sender_id)) { return; }
          this.unreadMessagesId.push(message.sender_id);
        });
      }
    );
  }

  rightPanelTypeListener(member: ZulipSingleUser): void {
    const index = this.unreadMessagesId.indexOf(member.user_id);
    this.unreadMessagesId.splice(index);
    this.router.navigate(['dashboard/messaging/narrow'], {
      queryParams: {
        id: member.user_id,
        member: member.full_name.replace(/\s/g, '')
      }
    });
  }

  handleShowSearchUser(): void {
    this.showSearchUser = !this.showSearchUser;
  }

}
