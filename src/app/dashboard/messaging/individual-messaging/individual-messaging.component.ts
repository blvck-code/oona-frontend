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
  currentUserSubject = new BehaviorSubject<object>({});
  currentUserObservable = this.currentUserSubject.asObservable();

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

    console.log('This hectic user ==>>', user);

    // this.currentUserSubject.next(user);
    //
    // this.currentUserObservable.subscribe((data) =>
    //   this.store.dispatch(new authActions.SetSelectedUser(data))
    // );

    // console.log(this.pmUser);

    // this.store.select(getAllUsers).subscribe(
    //   data => {
    //     const users = data?.members;
    //
    //     users?.forEach((user: any) => {
    //       const name = user.full_name.toLowerCase();
    //       const id = user.user_id;
    //
    //       // tslint:disable-next-line:triple-equals
    //       if (id == userId ) {
    //         this.pmUser = user;
    //       }
    //
    //     });
    //
    //     // console.log('Users ===>>>', users);
    //
    //     // users.map((user: any) => {
    //     //   console.log('User full name ===>>>', user.full_name);
    //     // });
    //
    //     // const currentUser = users.find((user: any) => user.full_name.toLowerCase() === this.pmUser);
    //     // console.log('Current user ====>>>', currentUser);
    //   }
    // );
  }

  fetchUserMessages(): void {
    this.store.select(getPrivateMessages).subscribe((data) => {
      data?.forEach((msg) => {
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
