import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {SharedService} from '../../../shared/services/shared.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  verificationError = false;
  verificationServerError = '';
  emptyForm = false;

  verifyAccountForm = this.formBuilder.group({
    email: ['', [Validators.required]],
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
    if (!this.verifyAccountForm.valid) {
      return;
    }

    const verificationInfo = new FormData();
    verificationInfo.append('email', this.verifyAccountForm.value.email);
    verificationInfo.append('token', this.verifyAccountForm.value.verifyCode);

    this.authService.verifyUser(verificationInfo)
      .subscribe(
        (verifyRes: any) => {
          this.router.navigate(['/login']);
          this.sharedSrv.showNotification('Account verified.', 'success');
        },
        (verifyErr: any) => {
          console.log('Verify error ==>>>', verifyErr);
          this.verificationError = true;
          // console.log('verifyErr: ', verifyErr);
          this.handleError(verifyErr.error);
        }
      );
  }

  handleError(error: any): void {
    if (error.error === 'Invalid or expired verification token.') {
      this.verificationServerError = 'The verification code is Invalid or Expired.';
    } else if (error.error === 'User not found.') {
      this.verificationServerError = 'The user email does not exist.';
    } else if (error.error === 'Your passwords do not match') {
      this.verificationServerError = 'The passwords entered do not match.';
    } else {
      this.verificationServerError = 'Please accept the appropriate certificates.';
    }
    this.sharedSrv.showNotification(this.verificationServerError, 'error');
  }

  get verificationFormControls(): any {
    return this.verifyAccountForm.controls;
  }

  isSubmitted(): any {
    if (!this.verifyAccountForm.valid) {
      this.emptyForm = true;
    }
  }

}
