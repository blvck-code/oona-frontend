import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../../shared/services/notification.service';
import {HttpErrorResponse} from '@angular/common/http';
import {SharedService} from '../../../shared/services/shared.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  resetPassError = false;
  resetPassServerError = '123';
  emptyForm = false;

  resetPassForm = this.formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', Validators.required],
    confirmPass: ['', Validators.required],
    verifyCode: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sharedSrv: SharedService
  ) { }

  ngOnInit(): void {
  }

  onReset(): any {
    if (!this.resetPassForm.valid) {
      return;
    }

    const resetInfo = new FormData();
    resetInfo.append('email', this.resetPassForm.value.email);
    resetInfo.append('password1', this.resetPassForm.value.password);
    resetInfo.append('password2', this.resetPassForm.value.confirmPass);
    resetInfo.append('token', this.resetPassForm.value.verifyCode);
    this.resetPassError = false;
    this.resetPassServerError = '';

    this.authService.resetUserPassword(resetInfo)
      .subscribe(
        (resetRes: any) => {
          this.sharedSrv.showNotification('Password reset successful', 'success');
          this.router.navigate(['/login']);
          console.log('Success ==>>', resetRes);
        },
        (resetErr: HttpErrorResponse) => {
          this.handleError(resetErr.error);
          this.resetPassError = true;
        }
      );

  }

  handleError(error: any): void {
    const email = error.email;
    const nonField = error.non_field_errors;
    const msg = error.msg;
    const password1 = error.password1;
    const password2 = error.password2;
    const errorMsg = error.error;

    console.log('Error ==>>', error);

    if (email) {
      this.sharedSrv.showNotification(email.toString(), 'error');
      this.resetPassServerError = email.toString();
    } else if (nonField) {
      this.sharedSrv.showNotification(nonField.toString(), 'error');
      this.resetPassServerError = nonField.toString();
    } else if (msg) {
      this.sharedSrv.showNotification(msg, 'error');
      this.resetPassServerError = msg;
    } else if (errorMsg) {
      this.sharedSrv.showNotification(errorMsg, 'error');
      this.resetPassServerError = errorMsg;
    } else if ( password1 && password2 && password1.toString() === password2.toString()) {
      this.sharedSrv.showNotification(password1.toString(), 'error');
      this.resetPassServerError = password1.toString();
    } else if (password2 && password1 !== password2) {
      this.sharedSrv.showNotification(password2, 'error');
      this.resetPassServerError = password2;
    }
  }


  get resetPassFormControls(): any {
    return this.resetPassForm.controls;
  }

  isSubmitted(): any {
    if (!this.resetPassForm.valid) {
      this.emptyForm = true;
    }
  }

}
