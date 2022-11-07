import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../state/app.state';
import {getPrivateUnread} from '../../../state/messaging.selectors';
import {SingleMessageModel} from '../../../models/messages.model';
import {PersonModel} from '../../../../models/person.model';
import {getUsers, usersLoading} from '../../../../state/entities/users.entity';

@Component({
  selector: 'app-all-users-panel',
  templateUrl: './all-users-panel.component.html',
  styleUrls: ['./all-users-panel.component.scss']
})
export class AllUsersPanelComponent implements OnInit {
  @Input() users$!: Observable<any>;
  @Output() rightPanelEvent = new EventEmitter<string>();
  searchText = '';
  showSearchUser = false;
  endPointUnreadId: number[] = [];

  allUsers$: Observable<PersonModel[]> = this.store.select(getUsers);
  usersLoading$: Observable<boolean> = this.store.select(usersLoading);

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.privateUnreadMessages();
  }

  handleShowSearchUser(): void {
    this.showSearchUser = !this.showSearchUser;
  }

  goToMemberChat(member: any): void {
    const index = this.endPointUnreadId.indexOf(member.user_id);
    this.endPointUnreadId.splice(index);

    this.router.navigate(['dashboard/messaging/narrow'], {
      queryParams: {
        id: member.user_id,
        member: member.full_name.replace(/\s/g, '')
      }
    });
    this.rightPanelEvent.emit('individual_user');

    this.endPointUnreadId.unshift(member.user_id);

  }

  privateUnreadMessages(): void{
    this.store.select(getPrivateUnread).subscribe(
      (messages: SingleMessageModel[]) => {
        messages.map((message: SingleMessageModel) => {
          if (this.endPointUnreadId.includes(message.sender_id)) { return; }
          this.endPointUnreadId.push(message.sender_id);
        });
      }
    );
  }
}
