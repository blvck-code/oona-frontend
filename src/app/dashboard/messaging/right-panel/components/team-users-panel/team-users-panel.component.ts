import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ZulipSingleUser} from '../../../../../auth/models/user.model';
import {Store} from '@ngrx/store';
import {getStreams} from '../../../../state/entities/streams.entity';
import {DashService} from '../../../../service/dash-service.service';
import {SubscribersResponseModel} from '../../../../models/streams.model';

import * as streamActions from '../../../../state/actions/streams.actions';
import * as userActions from '../../../../state/actions/users.actions';
import {getUsers} from '../../../../state/entities/users.entity';
import {PersonModel} from '../../../../models/person.model';

@Component({
  selector: 'app-team-users-panel',
  templateUrl: './team-users-panel.component.html',
  styleUrls: ['./team-users-panel.component.scss']
})
export class TeamUsersPanelComponent implements OnInit {
  @Output() rightPanelEvent = new EventEmitter<string>();
  @Input() users$!: Observable<ZulipSingleUser[]>;
  subscribersId!: number[];
  groupMembers: PersonModel[] = [];
  searchText = '';
  showSearchUser = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    private dashSrv: DashService
  ) {
    this.routerDetails();
  }

  ngOnInit(): void {
  }

  routerDetails(): void {
    this.route.queryParams.subscribe({
      next: (params) => {
        const streamId = params.id;
        this.streamSubscribers(streamId);
      }
    });
  }

  streamSubscribers(streamId: any): void {
    this.store.select(getStreams).subscribe({
      next: (streams) => {
        streams.map((stream) => {
          if (+stream.stream_id === +streamId) {
            this.dashSrv.streamSubscribers(stream.name).subscribe({
              next: (response: SubscribersResponseModel) => {
                const content = {
                  streamId: stream.stream_id,
                  subscribers: response.subscribers
                };
                this.getUserNames(response.subscribers);
              }
            });
          }
        } );
      }
    });
  }

  getUserNames(userIds: number[]): void {
    this.groupMembers = [];
    this.store.select(getUsers).subscribe({
      next: (users: PersonModel[]) => {
        users.map((user) => {
          userIds.forEach((id: number) => {
            if (id === user.user_id) {
              this.groupMembers.push(user);
            }
          });
        });
      }
    });
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
