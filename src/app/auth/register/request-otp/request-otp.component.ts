import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

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
    private router: Router,
    private toastr: ToastrService
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
          this.toastr.info('OTP has been sent to your email address and it expires in 5 mins.', 'Notification');
        },
        (requestOTPErr: any) => {
          this.requestOTPError = true;
          console.log('Request OTP Error', requestOTPErr);
          if (requestOTPErr.message === 'Invalid or expired verification token.') {
            this.requestOTPEServerError = 'The verification code is Invalid or Expired.';
          } else if (requestOTPErr.message === 'User not found.') {
            this.requestOTPEServerError = 'The user email does not exist.';
          } else if (requestOTPErr.message === 'Your passwords do not match') {
            this.requestOTPEServerError = 'The passwords entered do not match.';
          } else {
            this.requestOTPEServerError = 'Please accept the appropriate certificates.';
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
