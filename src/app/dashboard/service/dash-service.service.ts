import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import {StreamsResponseModel, SubStreamsResponseModel} from '../models/streams.model';

// NgRx
import {Store} from '@ngrx/store';
import {PersonResponseModel} from '../models/person.model';
import * as streamActions from '../state/actions/streams.actions';
import * as userActions from '../state/actions/users.actions';

@Injectable({
  providedIn: 'root'
})
export class DashService {

  constructor(
    private http: HttpClient,
    private store: Store
  ) { }

  onInitHandler(): void {
    this.store.dispatch(new streamActions.LoadSubStreams());
    this.store.dispatch(new userActions.LoadZulipUsers());
    this.store.dispatch(new userActions.LoadPresentUsers());
  }

  subStreams(): Observable<SubStreamsResponseModel> {
    return this.http.get<SubStreamsResponseModel>(env.subscribedStream);
  }

  presentUsers(): Observable<PersonResponseModel> {
    return this.http.get<PersonResponseModel>(env.presentUsers);
  }

  zulipUsers(): Observable<PersonResponseModel> {
    return this.http.get<PersonResponseModel>(env.zulipUsers);
  }
}
