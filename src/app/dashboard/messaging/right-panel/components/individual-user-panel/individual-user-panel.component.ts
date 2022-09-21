import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ZulipSingleUser} from '../../../../../auth/models/user.model';
import {ActivatedRoute, Router} from '@angular/router';
import * as messagingActions from '../../../state/messaging.actions';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.routerDetails();
  }

  routerDetails(): void {
    this.route.queryParams.subscribe(params => {
      const userId = params.id;
      console.log('Current user id ==>>', userId);

      this.users$.subscribe(
        (users: ZulipSingleUser[]) => {

          users.map(
            (user: ZulipSingleUser) => {
              if (user.user_id === +userId) {
                this.currentUser = user;
              }
            }
          );

        }
      );

    });
  }

  rightPanelTypeListener(member: any): void {
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
