import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../auth/services/auth.service';
import {Router} from '@angular/router';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndividualMessagingService {

  oonaProfile = env.oonaMemberProfileDetail;
  filteredMeetings = env.filteredMeetings;
  filteredAttendeeMeetings = env.filteredAttendeeMeetings;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  getOonaProfile(userEmail: string): any{
    return this.http.get(this.oonaProfile + userEmail, this.authService.getHeaders());
  }

  getMeetingsWhereIdIsHost(memberId: string): any{
    // ** get meetings where a user with this id is the host
    return this.http.get(this.filteredMeetings + memberId, this.authService.getHeaders());
  }

  getMeetingsWhereIdIsAttendee(memberId: string): any{
    return this.http.get(this.filteredAttendeeMeetings + memberId, this.authService.getHeaders());
  }
}
