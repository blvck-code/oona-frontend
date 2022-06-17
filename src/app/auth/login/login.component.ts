import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

// NgRx
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import * as authActions from '../state/auth.actions';
import {getErrorMessage, getIsLoggedIn} from '../state/auth.selectors';
import {Observable} from 'rxjs';
import {UserModel} from '../models/user.model';

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

  loginForm = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.handleRedirect();
    this.handleShowErrorMsg();
    this.redirectOnLogin();
  }

  handleRedirect(): any {
    this.isLoggedIn$ = this.store.select(getIsLoggedIn);

    this.isLoggedIn$.subscribe(
      data => {
        if (data) {
          this.router.navigate(['/dashboard']).then(r => console.log(123));
        }
      }
    );

    // this.store.select(getIsLoggedIn).subscribe(
    //   data => {
    //     if (data) {
    //       this.router.navigate(['/dashboard']);
    //     }
    //   }
    // );
  }

  handleShowErrorMsg(): any {
    this.errorMsg$ = this.store.select(getErrorMessage);
  }

  redirectOnLogin(): void {
    this.store.select(getIsLoggedIn).subscribe(
      data => data ? this.router.navigate(['/dashboard']) : null
    );
  }

  // loginUser(): any{
  //   this.store.dispatch(new authActions.LoginUser(this.loginForm.value));
  //   this.authService.login(this.loginForm.value).subscribe(
  //     (userInfo: UserModel) => {
  //
  //     }
  //   );
  // }

  onLogin(): any {
    if (!this.loginForm.valid) {
      return;
    }
    this.store.dispatch(new authActions.LoginUser(this.loginForm.value));
    const loginInfo = new FormData();
    loginInfo.append('email', this.loginForm.value.email);
    loginInfo.append('password', this.loginForm.value.password);

    this.authService.login(loginInfo)
      .subscribe(
        (loginRes: any) => {
          this.authService.saveToken(
            loginRes.token.access
          );
          this.authService.saveRefreshToken(
            loginRes.token.refresh
          );
          const redirectUrl = this.authService.redirectUrl;
          this.router.navigate([redirectUrl]);
        },
        (loginErr: any) => {
          this.loginError = true;
          console.log(loginErr);
          if (loginErr.error[0].non_field_errors[0] === 'Invalid login credentials') {
            this.loginServerError = 'Invalid login credentials. Please try again.';
          } else if (loginErr.error[0].non_field_errors[0] === 'Unable to login with provided credentials') {
            this.loginServerError = 'A user with the provided credentials does not exist.';
          }
          console.log(this.loginServerError);
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
