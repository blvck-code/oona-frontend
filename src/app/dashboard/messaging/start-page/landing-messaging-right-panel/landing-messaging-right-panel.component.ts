import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../../services/messaging.service';
import { oonaBaseUrl } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../shared/services/notification.service';
import { OonaSocketService } from '../../services/oona-socket.service';
import { AuthService } from '../../../../auth/services/auth.service';

// NgRx
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app.state';
import * as authActions from '../../../../auth/state/auth.actions';
import {getAllUsers, getZulipUsers} from '../../../../auth/state/auth.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-landing-messaging-right-panel',
  templateUrl: './landing-messaging-right-panel.component.html',
  styleUrls: ['./landing-messaging-right-panel.component.scss'],
})
export class LandingMessagingRightPanelComponent implements OnInit {
  allUsers = Array();
  serverUrl = oonaBaseUrl;
  recognizedUsers = Array();
  showSearchUser = false;
  showMoreInfo = true;
  socketUsers = Array();
  peopleTyping = Array();
  searchText = '';
  selectedUser: any;

  newMsgUsersId: number[] = [];

  constructor(
    private messagingService: MessagingService,
    private userSocketService: OonaSocketService,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.onInitPage();
    this.unreadMsg();

    this.userSocketService.currentUsers.subscribe(
      (users) => (this.socketUsers = users)
    );
    this.userSocketService.typing.subscribe((peopleTyping) => {
      this.peopleTyping = peopleTyping;
      this.addTypingStatus(peopleTyping);
    });

    // Todo change to present users

    this.messagingService.getZulipUsers().subscribe(
      (users: any) => {
        // @Todo Delete console log
        const usersPresent = users.members.filter((user: any) => user.presence);
        // this.allUsers = this.newListOfUsers(usersPresent);

        console.log('Zulip usrs ===>>', users);
        this.allUsers = users?.members;
      },
      // @ts-ignore
      (error) => {
        // console.log('Get users error ===>>', error);
        this.notification.showError(
          `Failed to get all users. Error ${error?.message}`,
          'Unable to get users'
        );
      }
    );
  }

  onInitPage(): void {
   this.store.select(getAllUsers).subscribe((users) => {

     // Todo change this back to active users and present users
     const usersPresent = users?.filter((user: any) => user.presence );
     // this.allUsers = this.newListOfUsers(usersPresent);
     this.allUsers = users;
   });
  }

  goToMemberChat(member: any): void {

    const userUrl = `${member.user_id}-${member.full_name
      .toLowerCase()
      .replace(/\s/g, '.')}`;

    this.router.navigate(['dashboard/messaging/narrow'], {
      queryParams: { member: userUrl },
    });

    this.store.dispatch(new authActions.SetSelectedUser(member));

    this.newMsgUsersId.filter(id => id === member.user_id);

    console.log('New messages list ===>>>', this.newMsgUsersId);


  }

  newListOfUsers(usersPresent: any): any[] {
    const allOnline = usersPresent?.filter(
      (user: { presence: { aggregated: { status: string } } }) =>
        user.presence.aggregated.status === 'active'
    );
    // tslint:disable-next-line:max-line-length
    const allOffline = usersPresent?.filter(
      (user: { presence: { aggregated: { status: string } } }) =>
        user.presence.aggregated.status === 'offline'
    );
    const allIdle = usersPresent?.filter(
      (user: { presence: { aggregated: { status: string } } }) =>
        user.presence.aggregated.status === 'idle'
    );

    allOnline?.sort(this.compare);

    return [
      ...allOnline?.sort(this.compare),
      ...allIdle?.sort(this.compare),
      ...allOffline?.sort(this.compare),
    ];
  }

  compare(member1: any, member2: any): number {
    // * order each list alphanumerically
    if (member1.full_name < member2.full_name) {
      return -1;
    }
    if (member1.full_name > member2.full_name) {
      return 1;
    }
    return 0;
  }

  private addTypingStatus(peopleTyping: any[]): void {
    if (this.allUsers) {
      this.allUsers?.map((user) => {
        const userIsTyping = peopleTyping.find(
          (person) => person.userEmail === user.email && person.op === 'start'
        );
        if (userIsTyping) {
          user.typing = true;
        } else {
          user.typing = false;
        }
      });
    }
  }

  handleShowSearchUser(): void {
    this.showSearchUser = !this.showSearchUser;
  }

  // Todo working on this
  searchUser(event: any): any {
    if (event.target.value !== '') {
      // tslint:disable-next-line:max-line-length
      this.allUsers = this.allUsers.filter(
        (user) =>
          user.full_name
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) ||
          user.email.toLowerCase().includes(event.target.value.toLowerCase())
      );
    } else {
      return this.allUsers;
    }
  }

  handleShowMoreInfo(user: any): void {
    this.selectedUser = user;
    this.showMoreInfo = !this.showMoreInfo;
  }

  unreadMsg(): void {
    this.userSocketService.privateMessageCountSocket.subscribe(
      prvMsg => {
        console.log('Unread messages for particular user dm ===>>>', prvMsg.length);
        prvMsg.map(msg => {
          console.log('Unread messages ===>>>', msg);
          this.newMsgUsersId.push(msg.sender_id);
          // if (this.messagesId.includes(msg.id)){
          //   return;
          // }

          // this.messagesId.push(msg.id);
          // this.messagesWithPerson.push(msg);
          // this.change.detectChanges();
          // this.scrollBottom();
        });
      }
    );
  }
}
