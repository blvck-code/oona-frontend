import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

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
    email: ['', [Validators.email, Validators.required]],
    verifyCode: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
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
          this.toastr.info('Account verified.', 'Notification');
        },
        (verifyErr: any) => {
          this.verificationError = true;
          // console.log('verifyErr: ', verifyErr);
          if (verifyErr.message === 'Invalid or expired verification token.') {
            this.verificationServerError = 'The verification code is Invalid or Expired.';
          } else if (verifyErr.message === 'User not found.') {
            this.verificationServerError = 'The user email does not exist.';
          } else if (verifyErr.message === 'Your passwords do not match') {
            this.verificationServerError = 'The passwords entered do not match.';
          } else {
            this.verificationServerError = 'Please accept the appropriate certificates.';
          }
        }
      );
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
