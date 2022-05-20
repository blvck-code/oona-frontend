import { Component, OnInit } from '@angular/core';
import {MessagingService} from '../../messaging.service';
import {environment} from '../../../../../environments/environment';
import {Router} from '@angular/router';
import {NotificationService} from '../../../../shared/services/notification.service';
import {OonaSocketService} from '../../oona-socket.service';
import {AuthService} from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-landing-messaging-right-panel',
  templateUrl: './landing-messaging-right-panel.component.html',
  styleUrls: ['./landing-messaging-right-panel.component.scss']
})
export class LandingMessagingRightPanelComponent implements OnInit {
  allUsers = Array();
  serverUrl = environment.oona;
  recognizedUsers = Array();
  socketUsers = Array();
  peopleTyping = Array();


  constructor(
    private messagingService: MessagingService,
    private userSocketService: OonaSocketService,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.userSocketService.currentUsers.subscribe(users =>
      (this.socketUsers = users));
    this.userSocketService.typing.subscribe( peopleTyping => {
       this.peopleTyping = peopleTyping;
       this.addTypingStatus(peopleTyping);
     });
    this.messagingService.getUsersByAvailability().subscribe((users: { members: any[]; }) => {

      const usersPresent = users.members.filter(user => user.presence );
      this.allUsers = this.newListOfUsers(usersPresent);
    },
      // @ts-ignore
      error => {
      this.notification.showError(`Failed to get all users. Error ${error.status}`, 'Unable to get users');
      });
  }

  goToMemberChat(member: any): void {
    this.router.navigate(['dashboard/messaging/narrow'], { queryParams: { member: member.full_name.replace(/\s/g, '') } });
  }

  newListOfUsers(usersPresent: any): any[]{
    const allOnline = usersPresent.filter((user: { presence: { aggregated: { status: string; }; }; }) => user.presence.aggregated.status === 'active' );
    // tslint:disable-next-line:max-line-length
    const allOffline = usersPresent.filter((user: { presence: { aggregated: { status: string; }; }; }) => user.presence.aggregated.status === 'offline' );
    const allIdle = usersPresent.filter((user: { presence: { aggregated: { status: string; }; }; }) => user.presence.aggregated.status === 'idle' );

    allOnline.sort(this.compare);

    return [ ...allOnline.sort(this.compare), ...allIdle.sort(this.compare), ...allOffline.sort(this.compare), ];
  }

  compare( member1: any, member2: any ): number{
    // * order each list alphanumerically
    if ( member1.full_name < member2.full_name ){
      return -1;
    }
    if ( member1.full_name > member2.full_name ){
      return 1;
    }
    return 0;
  }

  private addTypingStatus(peopleTyping: any[]): void {
    if (this.allUsers){
      this.allUsers.forEach( user => {
        const userIsTyping = peopleTyping.find( person => person.userEmail === user.email && person.op === 'start');
        if (userIsTyping){
          user.typing = true;
        }else{
          user.typing = false;
        }
      });
    }
  }
}
