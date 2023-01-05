import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/services/auth.service';
import { environment as env } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConferenceService {
  meetingDetailsUrl = env.meetingDetailsUrl;
  // usersUrl = env.getUserUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getMeetingDetails(id: string): any {
    return this.http.get(
      this.meetingDetailsUrl + id,
      this.authService.getHeaders()
    );
  }
  // getAllUsers(): any {
  //   return this.http.get(this.usersUrl, this.authService.getHeaders());
  // }
  inviteMembers(meetingData: any, id: any): any {
    return this.http.patch(
      this.meetingDetailsUrl + id + '/',
      meetingData,
      this.authService.getHeaders()
    );
  }
}
