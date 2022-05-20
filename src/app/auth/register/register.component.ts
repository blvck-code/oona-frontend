import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  signupError = false;
  signupServerError = '';
  emptyForm = false;

  registrationForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    secondName: ['', Validators.required],
    password1: ['', Validators.required],
    confirmPass: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onRegister(): any {
    if (!this.registrationForm.valid) {
      return;
    }
    const registrationInfo = new FormData();
    registrationInfo.append('email', this.registrationForm.value.email);
    registrationInfo.append('first_name', this.registrationForm.value.firstName);
    registrationInfo.append('last_name', this.registrationForm.value.secondName);
    registrationInfo.append('password1', this.registrationForm.value.password1);
    registrationInfo.append('password2', this.registrationForm.value.confirmPass);
    this.authService.registerUser(registrationInfo)
      .subscribe(
        (res: any) => {
          this.router.navigate(['/verify-account']);
        },
        (signupError: any) => {
          this.signupError = true;
          if (signupError.error.non_field_errors[0] === 'User with this email already exists.') {
            this.signupServerError = 'A User with this email already exists.';
          } else  if (signupError.error.non_field_errors[0] === 'The passwords don\'t match.') {
            this.signupServerError = 'The passwords do not match. Please try again.';
          } else if (signupError.error.non_field_errors[0] === 'This field may not be blank.') {
            this.signupServerError = 'Please fill all the required fields and try again.';
          }
        }
      );
  }

  get registrationFormControls(): any {
    return this.registrationForm.controls;
  }

  isSubmitted(): any {
    if (!this.registrationForm.valid) {
      this.emptyForm = true;
    }
  }

}
