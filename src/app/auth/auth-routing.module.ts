import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RequestComponent} from './login/reset/request/request.component';
import {ResetComponent} from './login/reset/reset.component';
import {RegisterComponent} from './register/register.component';
import {VerifyComponent} from './register/verify/verify.component';
import {RequestOtpComponent} from './register/request-otp/request-otp.component';
import {NgModule} from '@angular/core';

const authRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'request-reset', component: RequestComponent },
  { path: 'reset', component: ResetComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'verify-account', component: VerifyComponent },
  { path: 'request-otp', component: RequestOtpComponent },
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})

export class AuthRoutingModule {}
