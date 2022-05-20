import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/services/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConferenceService {
  meetingDetailsUrl = environment.oona + '/api/v1/meet/meetings/';
  usersUrl = environment.oona + '/api/v1/accounts/user/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getMeetingDetails(id: string): any {
    return this.http.get(
      this.meetingDetailsUrl + id,
      this.authService.getHeaders()
    );
  }
  getAllUsers(): any {
    return this.http.get(this.usersUrl, this.authService.getHeaders());
  }
  inviteMembers(meetingData: any, id: any): any {
    return this.http.patch(
      this.meetingDetailsUrl + id + '/',
      meetingData,
      this.authService.getHeaders()
    );
  }
}
