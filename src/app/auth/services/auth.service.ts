import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import { BROWSER_STORAGE } from '../storage';
import { OonaMeeting } from '../../dashboard/home/shared/oonaMeeting';
import { Form } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {PresentUsersResponse, ZulipSingleUser, ZulipUsersResponse} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginUrl = env.loginUrl;
  requestResetUrl = env.requestResetUrl;
  resetPassUrl = env.resetPassUrl;
  registrationUrl = env.registrationUrl;
  verificationUrl = env.verificationUrl;
  generateOTPUrl = env.generateOTPUrl;
  userProfileURL = env.userProfileURL;
  getUsersUrl = env.getUsersUrl;
  refreshTokenUrl = env.refreshTokenUrl;
  redirectUrl = '/dashboard';
  logoutUrl = env.logoutUrl;
  meetingDetailsUrl = env.meetingDetailsUrl;
  changePasswordUrl = env.changePasswordUrl;
  resetEmail = '';
  meetingId = '';
  currentUser = '';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  login(loginData: FormData): any {
    return this.http.post(this.loginUrl, loginData);
  }

  requestPassword(email: FormData): any {
    return this.http.post(this.requestResetUrl, email);
  }

  resetUserPassword(resetData: FormData): any {
    return this.http.post(this.resetPassUrl, resetData);
  }

  registerUser(data: FormData): any {
    return this.http.post(this.registrationUrl, data);
  }

  verifyUser(verificationData: FormData): any {
    return this.http.post(this.verificationUrl, verificationData);
  }

  generateOTP(userEmail: FormData): any {
    return this.http.post(this.generateOTPUrl, userEmail);
  }

  logout(): any {
    this.http.get(this.logoutUrl, this.getToken());
    this.storage.removeItem('ot');
    this.storage.removeItem('or');
    this.storage.removeItem('u?');
    localStorage.clear();
  }

  logoutUser(): Observable<any> {
    this.storage.removeItem('ot');
    this.storage.removeItem('or');
    this.storage.removeItem('u?');
    localStorage.clear();
    return this.http.get(this.logoutUrl, this.getToken());
  }

  getToken(): any {
    return this.storage.getItem('ot');
  }

  getRefreshToken(): any {
    return this.storage.getItem('or');
  }

  saveToken(token: string): any {
    this.storage.setItem('ot', token);
  }

  saveRefreshToken(refreshToken: string): any {
    this.storage.setItem('or', refreshToken);
  }

  isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  getHeaders(): any {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`,
      }),
    };
  }

  isTokenExpiring(): boolean {
    const token: string = this.getToken();
    const payload = JSON.parse(atob(token.split('.')[1]));
    const tokenValidity = payload.exp - Date.now() / 1000;
    if (this.isLoggedIn()) {
      return tokenValidity < 43200;
    } else {
      return false;
    }
  }

  refreshToken(): any {
    if (this.isLoggedIn() && this.isTokenExpiring()) {
      this.http
        .post(this.refreshTokenUrl, this.getRefreshToken(), this.getHeaders())
        .subscribe((tokenResponse: any) => {
          this.saveToken(tokenResponse.access);
          this.saveRefreshToken(tokenResponse.refresh);
        });
    }
  }

  getCurrentUser(): any {
    return this.http.get(this.getUsersUrl);
  }

  getUserProfile(): any {
    // console.log('Fetch profile fired');
    return this.http.get(this.userProfileURL);
  }

  getCurrentMeeting(id: string): any {
    return this.http.get(this.meetingDetailsUrl + id, this.getHeaders());
  }

  saveCurrentMeeting(currentMeeting: OonaMeeting): any {
    this.storage.setItem('meeting', JSON.stringify(currentMeeting));
  }

  saveCurrentMeetingId(meetingId: string): any {
    this.storage.setItem('MId', meetingId);
  }

  getCurrentMeetingId(): any {
    return this.storage.getItem('MId');
  }

  endCurrentMeeting(): any {
    this.storage.removeItem('MId');
  }

  saveCurrentUserName(currentUser: string): any {
    this.storage.setItem('u?', currentUser);
  }

  getCurrentUserName(): any {
    return this.storage.getItem('u?');
  }

  updateUserPassword(passwordData: any): any {
    return this.http.post(
      this.changePasswordUrl,
      passwordData,
      this.getHeaders()
    );
  }

  getAllUsers(): Observable<any> {
    return this.http.get(env.presentUsers, this.getToken());
  }

  getUsersByAvailability(): any {
    return this.http.get(env.presentUsers, this.getToken());
  }

  getAllUser(): any {
    return this.http.get(env.allUsers);
  }

  getZulipUsers(): Observable<any> {
    return this.http.get(env.zulipUsers, this.getToken());
  }

  zulipUsers$ = this.http
    .get<ZulipUsersResponse>(env.zulipUsers)
    .pipe(tap((data) => console.log(JSON.stringify(data))));

  presentUsers$ = this.http
    .get<PresentUsersResponse>(env.presentUsers)
    .pipe(tap((data) => console.log(JSON.stringify(data))));

  oonaUsers$ = this.http
    .get(env.presentUsers)
    .pipe(tap((data) => console.log(JSON.stringify(data))));

  allUsers$ = combineLatest([
    this.zulipUsers$,
    this.presentUsers$,
    this.oonaUsers$,
  ]).pipe(
    map(([
      zulipUsers,
      presentUsers,
      oonaUsers
     ]) =>
      zulipUsers.members?.map((zulipUser: ZulipSingleUser) => ({
        ...zulipUsers,
        presence: presentUsers?.members.find(
          oonaUser => oonaUser.user_id === zulipUser.user_id
        )?.presence
      }))
    )
  );
}
