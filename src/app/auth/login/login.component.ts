import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

// NgRx
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import * as authActions from '../state/auth.actions';
import {getAllUsers, getErrorMessage, getIsLoggedIn} from '../state/auth.selectors';
import {Observable} from 'rxjs';
import {UserModel} from '../models/user.model';
import * as messagingActions from '../../dashboard/messaging/state/messaging.actions';
import {log} from 'util';
import {ToastrService} from 'ngx-toastr';
import {take} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {SharedService} from '../../shared/services/shared.service';
import {AuthResponseModel} from '../../shared/models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoggedIn$!: Observable<boolean>;
  errorMsg$!: Observable<string>;
  loginError = false;
  loginServerError = '';
  emptyForm = false;
  loading = false;

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private store: Store<AppState>,
    private sharedSrv: SharedService
  ) {
  }

  ngOnInit(): void {
    this.handleShowErrorMsg();
    this.authService.redirectOnLogin();
    this.authService.redirectOnLogin();
  }

  handleShowErrorMsg(): any {
    this.errorMsg$ = this.store.select(getErrorMessage);
  }

  onLogin(): any {
    if (!this.loginForm.valid) {
      return;
    }
    this.loading = true;
    // this.store.dispatch(new authActions.LoginUser(this.loginForm.value));
    const loginInfo = new FormData();
    loginInfo.append('email', this.loginForm.value.email);
    loginInfo.append('password', this.loginForm.value.password);

    this.authService.login(loginInfo)
      .subscribe({
        next: (loginRes: AuthResponseModel) => {
          if (loginRes.message === 'Verify your account to retrieve token.') {
            this.loginServerError = 'Your account is not verified.';
            this.sharedSrv.showNotification('Your account is not verified.', 'info');
            this.loginError = true;
            this.loading = false;
            return;
          }

          console.log(loginRes);

          this.sharedSrv.showNotification(`Welcome back ${loginRes.user.first_name} ${loginRes.user.last_name}`, 'success');
          this.store.dispatch(new authActions.LoginUserSuccess(loginRes));

          this.loading = false;
          this.authService.saveToken(
            loginRes.token.access
          );
          this.authService.saveRefreshToken(
            loginRes.token.refresh
          );
          const redirectUrl = this.authService.redirectUrl;
          this.route.navigate(['/dashboard']);
        },
        error: (loginErr: HttpErrorResponse) => {
          this.loginError = true;
          this.loading = false;
          console.log('Log in error ==>>', loginErr);
          this.handleError(loginErr.error);
        }
      }
      );
  }

  handleError(error: any): void {
    console.log('Login error ===>>', error);
    const email = error?.email;
    const nonField = error[0]?.non_field_errors;
    const msg = error?.msg;

    if (email) {
      this.sharedSrv.showNotification(email.toString(), 'error');
      this.loginServerError = email.toString();
    } else if (nonField) {
      this.sharedSrv.showNotification(nonField.toString(), 'error');
      this.loginServerError = nonField.toString();
    } else if (msg) {
      this.sharedSrv.showNotification(msg, 'error');
      this.loginServerError = msg.toString();
    } else {
      this.sharedSrv.showNotification('Invalid credentials', 'error');
      this.loginServerError = 'Invalid credentials';
    }
  }

  get addLoginFormControls(): any {
    return this.loginForm.controls;
  }

  isSubmitted(): any {
    if (!this.loginForm.valid) {
      this.emptyForm = true;
    }
  }

}
