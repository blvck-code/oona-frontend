import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-request-otp',
  templateUrl: './request-otp.component.html',
  styleUrls: ['./request-otp.component.scss']
})
export class RequestOtpComponent implements OnInit {


  requestOTPError = false;
  requestOTPEServerError = '';
  emptyForm = false;

  requestOTPForm = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onRequestOTP(): any {
    if (!this.requestOTPForm.valid) {
      return;
    }

    const requestOTPInfo = new FormData();
    requestOTPInfo.append('email', this.requestOTPForm.value.email);

    this.authService.generateOTP(requestOTPInfo)
      .subscribe(
        (requestOTPRes: any) => {
          this.router.navigate(['/verify-account']);
        },
        (requestOTPErr: any) => {
          this.requestOTPError = true;
          // console.log('Request OTP Error', requestOTPErr);
          if (requestOTPErr.error.error === 'Invalid or expired verification token.') {
            this.requestOTPEServerError = 'The verification code is Invalid or Expired.';
          } else if (requestOTPErr.error.error === 'User not found.') {
            this.requestOTPEServerError = 'The user email does not exist.';
          } else if (requestOTPErr.error.non_field_errors[0] === 'Your passwords do not match') {
            this.requestOTPEServerError = 'The passwords entered do not match.';
          }
        }
      );
  }

  get requestOTPFormControls(): any {
    return this.requestOTPForm.controls;
  }

  isSubmitted(): any {
    if (!this.requestOTPForm.valid) {
      this.emptyForm = true;
    }
  }

}
