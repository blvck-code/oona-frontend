import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../auth/services/auth.service';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  firstName = '';
  secondName = '';
  email = '';
  lastLogin: any;
  emptyForm = false;
  changeSuccessful = false;

  resetPasswordForm = this.formBuilder.group({
    currentPass: ['', Validators.required],
    newPass: ['', [Validators.required, Validators.minLength(8)]],
    confirmPass: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (userData: any) => {
        console.log(userData);
        this.firstName = userData.results[0].first_name;
        this.secondName = userData.results[0].last_name;
        const userName = this.firstName + ` ` + this.secondName;
        this.authService.saveCurrentUserName(userName);
        this.email = userData.results[0].email;
        this.lastLogin = userData.results[0].last_login;
      }
    );
  }

  onResetPass(): void {
    if (!this.resetPasswordForm.valid) {
      return;
    }
    const passwordInfo = new FormData();
    passwordInfo.append('old_password', this.resetPasswordForm.value.currentPass);
    passwordInfo.append('password1', this.resetPasswordForm.value.newPass);
    passwordInfo.append('password2', this.resetPasswordForm.value.confirmPass);

    this.authService.updateUserPassword(passwordInfo)
      .subscribe(
        (resetPassRes: any) => {
          this.resetPasswordForm.reset();
          this.changeSuccessful = true;
          setTimeout(() => {
            this.changeSuccessful = false;
          }, 2500);
          console.log(resetPassRes);
        },
        (resetPassErr: any) => {
          console.log(resetPassErr);
        }
      );
  }

  get addResetPassFormControls(): any {
    return this.resetPasswordForm.controls;
  }

  isSubmitted(): any {
    if (!this.resetPasswordForm.valid) {
      this.emptyForm = true;
    }
  }

}
