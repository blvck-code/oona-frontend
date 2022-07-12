import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../../shared/services/notification.service';

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
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.required],
    confirmPass: ['', Validators.required],
    verifyCode: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notify: NotificationService
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
          this.router.navigate(['/login']);
        },
        (resetErr: any) => {
          console.log('Error message from component ===>>>>', resetErr.message);
          this.resetPassServerError = resetErr.message;

          this.resetPassError = true;
          // if (resetErr?.error.error === 'Invalid or expired verification token.') {
          //   this.resetPassServerError = 'The verification code is Invalid or Expired.';
          // } else if (resetErr?.error.error === 'User not found.') {
          //   this.resetPassServerError = 'The user email does not exist.';
          // } else if (resetErr?.error.non_field_errors[0] === 'Your passwords do not match') {
          //   this.resetPassServerError = 'The passwords entered do not match.';
          // }
        }
      );

    console.log('Message ===>>>', this.resetPassServerError);
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
