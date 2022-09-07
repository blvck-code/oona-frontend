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
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private store: Store<AppState>,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.handleShowErrorMsg();
    // this.redirectOnLogin();
  }

  handleShowErrorMsg(): any {
    this.errorMsg$ = this.store.select(getErrorMessage);
  }

  redirectOnLogin(): void {
    this.store.select(getIsLoggedIn).subscribe(
      (status: boolean) => {

        if (status) {
          this.route.navigate(['/dashboard']);
          this.store.dispatch(new authActions.LoadZulipUsers);
          this.store.dispatch(new messagingActions.LoadAllStreams);
        }

        return;
      }
    );
    this.store.dispatch(new authActions.LoadAllUsers);
  }

  onLogin(): any {
    let count = 0;
    if (!this.loginForm.valid) {
      return;
    }
    this.loading = true;
    // this.store.dispatch(new authActions.LoginUser(this.loginForm.value));
    const loginInfo = new FormData();
    loginInfo.append('email', this.loginForm.value.email);
    loginInfo.append('password', this.loginForm.value.password);


    this.authService.login(loginInfo)
      .subscribe(
        (loginRes: any) => {
          // console.log('Login response ===>>>', loginRes);
          // take(1)
          count += 1;

          if (loginRes.message === 'Verify your account to retrieve token.') {
            this.loginServerError = 'Your account is not verified.';
            this.loginError = true;
            this.loading = false;
          }

          if (count === 1) {
            this.toastr.info('Login successful.', 'Notification');
            this.store.dispatch(new authActions.LoginUserSuccess(loginRes));
          }

          this.loading = false;
          this.authService.saveToken(
            loginRes.token.access
          );
          this.authService.saveRefreshToken(
            loginRes.token.refresh
          );
          // this.handleRedirect();
          const redirectUrl = this.authService.redirectUrl;
          this.route.navigate(['/dashboard']);
        },
        (loginErr: any) => {
          this.loginServerError = loginErr.message;
          this.loginError = true;
          this.loading = false;
          console.log('Log in error ==>>', loginErr);
        }
      );
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
