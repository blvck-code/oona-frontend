import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app.state';
import { getZulipProfile } from '../../../../auth/state/auth.selectors';
import { Observable } from 'rxjs';
import { oonaFrontendUrl } from '../../../../../environments/environment';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { SingleMessageModel } from '../../models/message.model';
import * as privateMsgActions from '../../../../dashboard/state/actions/private.messages.actions';
import { DashService } from '../../../service/dash-service.service';

@Component({
  selector: 'app-all-private-messages-card',
  templateUrl: './all-private-messages-card.component.html',
  styleUrls: ['./all-private-messages-card.component.scss'],
})
export class AllPrivateMessagesCardComponent implements OnInit {
  // @ts-ignore
  @Input() messageDetail: any;
  @Input() userId$!: Observable<number>;
  @ViewChild('currentChat') endChat: ElementRef | undefined;
  @ViewChild('intersection') 'intersection': ElementRef;

  messageTime = '';
  zulipProfile!: Observable<any>;
  baseURL = oonaFrontendUrl;
  imageURL = '';
  isVisible = false;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private dashSrv: DashService
  ) {
    this.getUserInfo();
    this.routerDetails();
  }

  ngOnInit(): void {
    // @ts-ignore
    this.messageTime = moment(this.messageDetail.timestamp * 1000).calendar();
    this.imageURL = `${this.baseURL}${this.messageDetail?.avatar_url}&s=50`;

    this.handleDate();
    this.routerDetails();
    this.handleReadFlag();
  }

  handleReadFlag(): void {
    if (this.messageDetail?.flags.includes('read')) {
      return;
    }

    setTimeout(() => {
      this.chatObserver(this.intersection).subscribe({
        next: (isVisible) => {
          if (isVisible) {
            // dispatch unread flags
            const updateContent = {
              messages: [this.messageDetail.id],
              flag: 'read',
              op: 'add',
            };

            this.dashSrv.updateMessageFlags(updateContent).subscribe({
              next: (resp) => {
                if (resp.result === 'success') {
                  this.store.dispatch(
                    new privateMsgActions.UpdateMessageFlag({
                      messages: this.messageDetail.id,
                      flag: [...this.messageDetail.flags, 'read'],
                    })
                  );
                }
              },
            });
          }
        },
      });
    }, 1000);
  }

  routerDetails(): void {
    this.route.queryParams.subscribe((params) => {
      const streamId = params.id;
      const topic = params.topic;
    });
  }

  getUserInfo(): void {
    this.zulipProfile = this.store.select(getZulipProfile);
  }

  handleDate(): void {
    // @ts-ignore
    const time = this.messageDetail.timestamp;
  }

  chatObserver(element: ElementRef): Observable<boolean> {
    return new Observable((observe) => {
      const intersectionObserver = new IntersectionObserver((entries) => {
        observe.next(entries);
      });

      intersectionObserver.observe(element.nativeElement);

      return () => {
        intersectionObserver.disconnect();
      };
    }).pipe(
      // @ts-ignore
      switchMap((entries: IntersectionObserverEntry) => entries),
      map((entry: any) => entry.isIntersecting),
      distinctUntilChanged()
    );
  }
}
