import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {SharedService} from '../../../shared/services/shared.service';
import {HttpErrorResponse} from '@angular/common/http';

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
    private sharedSrv: SharedService
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
          this.sharedSrv.showNotification('OTP has been sent to your email address and it expires in 5 mins.', 'success');
        },
        (requestOTPErr: HttpErrorResponse) => {
          console.log('Request OTP Error', requestOTPErr);
          this.handleError(requestOTPErr.error);
        }
      );
  }

  handleError(error: any): void {
    if (error.error === 'Invalid or expired verification token.') {
      this.requestOTPEServerError = 'The verification code is Invalid or Expired.';
    } else if (error.error === 'User not found.') {
      this.requestOTPEServerError = 'The user email does not exist.';
    } else if (error.error === 'Your passwords do not match') {
      this.requestOTPEServerError = 'The passwords entered do not match.';
    } else {
      this.requestOTPEServerError = 'Please accept the appropriate certificates.';
    }
    this.sharedSrv.showNotification(this.requestOTPEServerError, 'error');
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
