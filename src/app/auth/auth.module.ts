import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {RequestComponent} from './login/reset/request/request.component';
import {RegisterComponent} from './register/register.component';
import {VerifyComponent} from './register/verify/verify.component';
import {ResetComponent} from './login/reset/reset.component';
import {RequestOtpComponent} from './register/request-otp/request-otp.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthRoutingModule} from './auth-routing.module';
import {StoreModule} from '@ngrx/store';
import {authReducer} from './state/auth.reducer';
import {EffectsModule} from '@ngrx/effects';
import {AuthEffects} from './state/auth.effects';
import {MessagingModule} from '../dashboard/messaging/messaging.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
    ResetComponent,
    RequestOtpComponent,
    RequestComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AuthRoutingModule,
        StoreModule.forFeature('userCenter', authReducer),
        EffectsModule.forFeature([AuthEffects]),
        MessagingModule
    ]
})

export class AuthModule { }
