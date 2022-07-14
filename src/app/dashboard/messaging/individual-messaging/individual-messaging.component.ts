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
import * as messageActions from '../state/messaging.actions';

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
  initialMessageCount = 30;
  recipientInfo!: Observable<any>;

  currentUserIdSubject = new BehaviorSubject<object>({});
  currentUserIdObservable = this.currentUserIdSubject.asObservable();

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private route: Router
  ) {
    this.changeContentOnRouteChange();
  }

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
              this.pmUser = user;
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

      if (event instanceof NavigationStart) {
        setTimeout(() => {
          this.getUserMessages();
        }, 1000);
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

  getUserMessages(): void {
    const streamDetail = {
      use_first_unread_anchor: true,
      apply_markdown: false,
      num_before: this.initialMessageCount,
      type: [
        {
          operator: 'pm-with',
          operand: this.pmUser?.email,
        }
      ]
    };

    console.log('Message being fetched payload: ', streamDetail);

    // fetch messages from server
    this.store.dispatch(new messageActions.LoadPrivateMessages(streamDetail));

    // get messages from store
    this.store.select(getPrivateMessages).subscribe(
      messages => console.log('Messages: ', messages)
    );

    // @ts-ignore
    document.getElementById('box').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
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
