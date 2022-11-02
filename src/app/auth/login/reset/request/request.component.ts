import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {SharedService} from '../../../../shared/services/shared.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

  requestResetError = false;
  requestResetServerError = '';
  emptyForm = false;

  requestResetForm = this.formBuilder.group({
    email: ['', [Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sharedSrv: SharedService
  ) { }

  ngOnInit(): void {
  }

  onLogin(): any {
    if (!this.requestResetForm.valid) {
      return;
    }
    const userEmail = new FormData();
    userEmail.append('email', this.requestResetForm.value.email);

    this.authService.requestPassword(userEmail)
      .subscribe(
        (resetRes: any) => {
          this.router.navigate(['/reset']);
          this.sharedSrv.showNotification('Password reset token sent.', 'success');
        },
        (resetErr: HttpErrorResponse) => {
          this.handleError(resetErr.error);
          this.requestResetError = true;
          if (resetErr.message === 'User not found.') {
            this.requestResetServerError = 'Email entered does not exist.';
          }
        }
      );
  }

  handleError(error: any): void {
    console.log('Request change error ==>>', error);

    if (error.error === 'Invalid or expired verification token.') {
      this.requestResetServerError = 'The verification code is Invalid or Expired.';
    } else if (error.error === 'User not found.') {
      this.requestResetServerError = 'The user email does not exist.';
    } else if (error.error === 'Your passwords do not match') {
      this.requestResetServerError = 'The passwords entered do not match.';
    } else {
      this.requestResetServerError = 'Please accept the appropriate certificates.';
    }
    this.sharedSrv.showNotification(this.requestResetServerError, 'error');
  }

  get addLoginFormControls(): any {
    return this.requestResetForm.controls;
  }

  isSubmitted(): any {
    if (!this.requestResetForm.valid) {
      this.emptyForm = true;
    }
  }


}
