import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ZulipSingleUser} from '../../../../../auth/models/user.model';

@Component({
  selector: 'app-team-users-panel',
  templateUrl: './team-users-panel.component.html',
  styleUrls: ['./team-users-panel.component.scss']
})
export class TeamUsersPanelComponent implements OnInit {
  @Output() rightPanelEvent = new EventEmitter<string>();
  @Input() users$!: Observable<ZulipSingleUser[]>;
  searchText = '';
  showSearchUser = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  rightPanelTypeListener(member: any): void {
    this.router.navigate(['dashboard/messaging/narrow'], {
      queryParams: {
        id: member.user_id,
        member: member.full_name.replace(/\s/g, '')
      }
    });
    this.rightPanelEvent.emit('individual_user');
  }

  handleShowSearchUser(): void {
    this.showSearchUser = !this.showSearchUser;
  }
}
