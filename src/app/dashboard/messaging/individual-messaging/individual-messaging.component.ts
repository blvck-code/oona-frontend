import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationStart, ParamMap, Params, Router} from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { getAllUsers } from '../../../auth/state/auth.selectors';

// NgRx
import * as authActions from '../../../auth/state/auth.actions';
import { getPrivateMessages } from '../state/messaging.selectors';
import { SingleMessageModel } from '../models/messages.model';
import {BehaviorSubject, Observable} from 'rxjs';
import { retagTsFile } from '@angular/compiler-cli/src/ngtsc/shims';
import * as events from 'events';

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


    const urlUser = {
      userId,
      userName,
    };

    this.currentUserIdSubject.next(urlUser);

    setTimeout(() => {
      this.store.select(getAllUsers).subscribe(
        data => {
          // tslint:disable-next-line:no-shadowed-variable
          data?.map((user: any) => {
            if (+user.user_id === +userId){
              this.store.dispatch(new authActions.SetSelectedUser(user));
            }
          });
        }
      );
    }, 500);
  }

  // @ts-ignore
  changeContentOnRouteChange(): void {
    // @ts-ignore
    this.route.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.onInitHandler();
      }
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
    this.changeContentOnRouteChange();

    this.activatedRoute.params.subscribe(
      (params: Params) => (this.myParam = params.member)
    );
  }
}
