import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as userActions from '../../state/actions/users.actions';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-individual-messaging',
  templateUrl: './individual-messaging.component.html',
  styleUrls: ['./individual-messaging.component.scss'],
})
export class IndividualMessagingComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private store: Store
  ) {
    this.routerDetails();
  }

  routerDetails(): void {
    this.route.queryParams.subscribe(params => {
      const userId = params.id;
      // this.currentUserId = params.id;
      // this.store.dispatch(new messagingActions.SelectedUserId(+userId));
      this.store.dispatch(new userActions.CurrentUser(+userId));
    });

    const payload = {
      anchor: 'first_unread',
      num_before: 50,
      num_after: 50,
      narrow: [{
        negated: false,
        operator: 'pm-with',
        operand: [] // User Id
      }]
    }
  }

  ngOnInit(): void {}

}
