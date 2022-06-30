import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { getAllUsers } from '../../../auth/state/auth.selectors';

// NgRx
import * as authActions from '../../../auth/state/auth.actions';
import { getPrivateMessages } from '../state/messaging.selectors';
import { SingleMessageModel } from '../models/messages.model';
import {BehaviorSubject, Observable} from 'rxjs';
import { retagTsFile } from '@angular/compiler-cli/src/ngtsc/shims';

@Component({
  selector: 'app-individual-messaging',
  templateUrl: './individual-messaging.component.html',
  styleUrls: ['./individual-messaging.component.scss'],
})
export class IndividualMessagingComponent implements OnInit {
  order: any;
  myParam: any;
  pmUser: any;
  pmMessages: any = [];
  recipientInfo!: Observable<any>;

  currentUserIdSubject = new BehaviorSubject<object>({});
  currentUserIdObservable = this.currentUserIdSubject.asObservable();

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private route: Router
  ) {}

  onInitHandler(): void {
    const currentUser = this.activatedRoute.snapshot.queryParams?.member;

    const userId = +currentUser.split('-')[0];
    const userName = currentUser.split('-')[1].replace('.', ' ');


    const user = {
      userId,
      userName,
    };

    this.currentUserIdSubject.next(user);

    // set seletected user
    this.currentUserIdObservable.subscribe(data => {
      this.store.dispatch(new authActions.SetSelectedUser(data));
    });
  }

  fetchUserMessages(): void {
    this.store.select(getPrivateMessages).subscribe((data) => {
      data?.map((msg) => {
        if (msg.recipient_id === 21) {
          this.pmMessages = [...this.pmMessages, msg];
        }
      });
    });
  }

  ngOnInit(): void {
    this.onInitHandler();
    this.fetchUserMessages();
    this.activatedRoute.params.subscribe(
      (params: Params) => (this.myParam = params.member)
    );
    console.log('Private messages ===>>>', this.pmMessages);
  }
}
