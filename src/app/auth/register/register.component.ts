import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpErrorResponse} from '@angular/common/http';
import {SharedService} from '../../shared/services/shared.service';
import {ConfirmedValidator} from './confirmed.validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  signupError = false;
  signupServerError = '';
  emptyForm = false;
  loading = false;

  registrationForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    secondName: ['', Validators.required],
    password1: ['',
      Validators.required,
    ],
    confirmPass: ['', Validators.required]
  }, {
    validator: ConfirmedValidator('password1', 'confirmPass')
  });

  public account = {
    password: ''
  };
  public barLabel = 'Password strength:';
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
  public thresholds = [90, 75, 45, 25];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sharedSrv: SharedService
  ) { }

  ngOnInit(): void {
  }

  onRegister(): any {
    if (!this.registrationForm.valid) {
      return;
    }
    this.loading = true;
    const registrationInfo = new FormData();
    registrationInfo.append('email', this.registrationForm.value.email);
    registrationInfo.append('first_name', this.registrationForm.value.firstName);
    registrationInfo.append('last_name', this.registrationForm.value.secondName);
    registrationInfo.append('password1', this.registrationForm.value.password1);
    registrationInfo.append('password2', this.registrationForm.value.confirmPass);
    this.authService.registerUser(registrationInfo)
      .subscribe({
        next: (res: any) => {
          this.router.navigate(['/verify-account']);
          this.loading = false;
          this.sharedSrv.showNotification('Account created successful.', 'success');
        },
        error: (signupError: HttpErrorResponse) => {
          this.loading = false;
          this.signupError = true;
          this.handleError(signupError.error);
        }
      });
  }

  handleError(error: any): void {
    const email = error.email;
    const nonField = error.non_field_errors;
    const msg = error.msg;

    if (email) {
      this.sharedSrv.showNotification(email.toString(), 'error');
      this.signupServerError = email.toString();
    } else if (nonField) {
      this.sharedSrv.showNotification(nonField.toString(), 'error');
      this.signupServerError = nonField.toString();
    } else if (msg) {
      this.sharedSrv.showNotification(msg, 'error');
      this.signupServerError = msg;
    }
  }


  get registrationFormControls(): any {
    return this.registrationForm.controls;
  }

  isSubmitted(): any {
    if (!this.registrationForm.valid) {
      this.emptyForm = true;
      this.registrationForm.get('password1')?.reset();
      this.registrationForm.get('password2')?.reset();
    }
  }

}
