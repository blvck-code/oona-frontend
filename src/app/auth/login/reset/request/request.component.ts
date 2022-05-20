import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

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
    email: ['', [Validators.email, Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
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
        },
        (resetErr: any) => {
          this.requestResetError = true;
          if (resetErr.error.error === 'User not found.') {
            this.requestResetServerError = 'Email entered does not exist.';
          }
        }
      );
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
