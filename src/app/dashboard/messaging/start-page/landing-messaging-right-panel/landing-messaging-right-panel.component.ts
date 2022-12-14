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
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { SingleMessageModel } from '../../models/messages.model';
import {
  SinglePresentUser,
  UserModel,
  ZulipSingleUser,
} from '../../../../auth/models/user.model';
import { PersonModel } from '../../../models/person.model';
import { getUsers, usersLoading } from '../../../state/entities/users.entity';

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
  loadedUsers = false;

  listedUsersArray: any[] = [];

  zulipUsers: any[] = [];
  zulipUsersSubject$ = new BehaviorSubject<any[]>(this.zulipUsers);
  zulipUserObservable = this.zulipUsersSubject$.asObservable();

  endPointUnreadId: number[] = [];

  allUsers$: Observable<PersonModel[]> = this.store.select(getUsers);
  usersLoading$: Observable<boolean> = this.store.select(usersLoading);

  constructor(
    private messagingService: MessagingService,
    private userSocketService: OonaSocketService,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.unreadMsg();
    // this.privateUnreadMessages();
    this.unreadMessages();

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

  // privateUnreadMessages(): void {
  //   this.store.select(getPrivateUnread).subscribe(
  //     (messages: SingleMessageModel[]) => {
  //       messages.map((message: SingleMessageModel) => {
  //         this.endPointUnreadId.push(message.sender_id);
  //       });
  //     }
  //   );
  // }

  unreadMsg(): void {
    this.userSocketService.privateMessageCountSocket.subscribe((prvMsg) => {
      console.log(
        'Unread messages for particular user dm ===>>>',
        prvMsg.length
      );
      prvMsg.map((msg) => {
        console.log('Unread messages ===>>>', msg);
        this.endPointUnreadId.push(msg.sender_id);
        // if (this.messagesId.includes(msg.id)){
        //   return;
        // }

        // this.messagesId.push(msg.id);
        // this.messagesWithPerson.push(msg);
        // this.change.detectChanges();
        // this.scrollBottom();
      });
    });
  }

  // onInitPage(): void {
  //   if (!this.allUsers  ) {
  //     return;
  //   } else {
  //     this.store.select(getAllUsers).subscribe((users) => {
  //       // Todo change this back to active users and present users
  //       // const usersPresent = users?.filter((user: any) => user.presence);
  //       // this.allUsers = this.newListOfUsers(usersPresent);
  //       const newArray: any[] = [];
  //
  //       users?.map((user: SinglePresentUser) => {
  //         const userDetail = {
  //           name: user.full_name,
  //           user_id: user.user_id,
  //           role: user.role,
  //           counter: 0
  //         };
  //
  //         this.listedUsersArray.push(userDetail);
  //       });
  //     });
  //   }
  //
  //   this.loadedUsers = true;
  //   this.getPrivateUnreadMsg();
  //   // this.handleUsers();
  // }

  // handleUsers(): void {
  //   this.store.select(getZulipUsers).subscribe(
  //     (users: any) => {
  //       this.zulipUsersSubject$.next(users.members);
  //     }
  //   );
  // }

  goToMemberChat(member: any): void {
    this.router.navigate(['dashboard/messaging/narrow'], {
      queryParams: {
        id: member.user_id,
        member: member.full_name.replace(/\s/g, ''),
      },
    });

    this.endPointUnreadId.filter((id) => id !== member.user_id);
  }

  // getPrivateUnreadMsg(): void {
  //
  //   const messagesId: number[] = [];
  //
  //   this.store.select(getPrivateMessages).subscribe(
  //     (messages: SingleMessageModel[]) => {
  //       messages.map((message: SingleMessageModel) => {
  //
  //         if (message.flags.includes('read')){
  //           return;
  //         }
  //
  //         if (messagesId.includes(message.id)){
  //           return;
  //         }
  //
  //         this.endPointUnreadId.push(message.sender_id);
  //         messagesId.push(message.id);
  //
  //       });
  //     }
  //   );
  // }

  unreadMessages(): void {
    this.zulipUserObservable.subscribe((zulipUsers: ZulipSingleUser[]) => {});
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
}
