import { Component, OnInit } from '@angular/core';
import {OonaSocketService} from '../oona-socket.service';

@Component({
  selector: 'app-all-private-messaging',
  templateUrl: './all-private-messaging.component.html',
  styleUrls: ['./all-private-messaging.component.scss']
})
export class AllPrivateMessagingComponent implements OnInit {

  constructor(
    private userSocketService: OonaSocketService
  ) { }

  ngOnInit(): void {
    this.changeMessageCount();
  }

  private changeMessageCount(): void {
    this.userSocketService.newMessageCount = 0;
    this.userSocketService.changeNewMessageCount(0);

    this.userSocketService.newMessageCount = 0;
    this.userSocketService.changeNewMessageCount(this.userSocketService.newMessageCount);
  }
}
