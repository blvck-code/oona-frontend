import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

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

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  handleShowSearchUser(): void {
    this.showSearchUser = !this.showSearchUser;
  }

  goToMemberChat(member: any): void {

    this.router.navigate(['dashboard/messaging/narrow'], {
      queryParams: {
        id: member.user_id,
        member: member.full_name.replace(/\s/g, '')
      }
    });
    this.rightPanelEvent.emit('individual_user');

    this.endPointUnreadId.filter((id) => id !== member.user_id);

  }
}
