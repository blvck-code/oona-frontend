import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BROWSER_STORAGE} from '../storage';
import {OonaMeeting} from '../../dashboard/home/shared/oonaMeeting';
import {Form} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginUrl = environment.oona + '/api/v1/accounts/login/';
  requestResetUrl = environment.oona + '/api/v1/accounts/password/reset/request/';
  resetPassUrl = environment.oona + '/api/v1/accounts/password/reset/';
  registrationUrl = environment.oona + '/api/v1/accounts/register/';
  verificationUrl = environment.oona + '/api/v1/accounts/verify/otp/';
  generateOTPUrl = environment.oona + '/api/v1/accounts/generate/otp/';
  userProfileURL = environment.oona + '/api/v1/accounts/profile/';
  getUserUrl = environment.oona + '/api/v1/accounts/users';
  refreshTokenUrl = environment.oona + '/api/v1/accounts/token/refresh/';
  redirectUrl = '/dashboard';
  logoutUrl = environment.oona + '/api/v1/accounts/logout';
  meetingDetailsUrl = environment.oona + '/api/v1/meet/meetings/';
  changePasswordUrl = environment.oona + '/api/v1/accounts/password/change/';
  resetEmail = '';
  meetingId = '';
  currentUser = '';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
   ) { }

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
    this.http.get(this.logoutUrl);
    this.storage.removeItem('ot');
    this.storage.removeItem('or');
    this.storage.removeItem('u?');
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
      return payload.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

  getHeaders(): any {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    };
  }

  isTokenExpiring(): boolean {
    const token: string = this.getToken();
    const payload = JSON.parse(atob(token.split('.')[1]));
    const tokenValidity = payload.exp - (Date.now() / 1000);
    if (this.isLoggedIn()) {
      return tokenValidity < 43200;
    } else {
      return false;
    }
  }

  refreshToken(): any {
    if (this.isLoggedIn() && this.isTokenExpiring() ) {
      this.http.post(this.refreshTokenUrl, this.getRefreshToken(), this.getHeaders()).subscribe(
        (tokenResponse: any) => {
          this.saveToken(tokenResponse.access);
          this.saveRefreshToken(tokenResponse.refresh);
        }
      );
    }
  }

  getCurrentUser(): any {
    console.log('Funny you not working');
    return this.http.get(this.getUserUrl);
  }

  getUserProfile(): any {
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
    return this.http.post(this.changePasswordUrl, passwordData, this.getHeaders());
  }

}
