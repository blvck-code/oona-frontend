import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment as env } from '../../../../environments/environment';
import {AuthService} from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  usersUrl = env.getUserUrl;
  meetingsUrl = env.meetingDetailsUrl;
  scheduleMeetingsUrl = env.meetingDetailsUrl;
  meetingDetailsUrl = env.meetingDetailsUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAllUsers(): any {
    return this.http.get(this.usersUrl, this.authService.getHeaders());
  }

  getAllMeetings(): any {
    return this.http.get(this.meetingsUrl, this.authService.getHeaders());
  }

  getMeetingDetails(id: string): any {
    return this.http.get(this.meetingDetailsUrl + id, this.authService.getHeaders());
  }

  scheduleMeeting(meetingData: any): any {
    return this.http.post(this.scheduleMeetingsUrl, meetingData, this.authService.getHeaders());
  }

  editMeeting(editMeetingData: any, id: any): any {
    return this.http.patch(this.meetingsUrl + id + '/', editMeetingData, this.authService.getHeaders());
  }

  deleteMeeting(meetingId: string): any {
    return this.http.delete(this.meetingsUrl + meetingId + '/', this.authService.getHeaders());
  }
}
