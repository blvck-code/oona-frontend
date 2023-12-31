import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import {ReactiveFormsModule} from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// tslint:disable-next-line:max-line-length
import {HtmlEditorService, ImageService, LinkService, RichTextEditorAllModule, ToolbarService} from '@syncfusion/ej2-angular-richtexteditor';
import {MatDialogModule} from '@angular/material/dialog';
import {NgxEmojiPickerModule} from 'ngx-emoji-picker';
import {ShowdownModule} from 'ngx-showdown';
import {SharedModule} from './shared/shared.module';
// NgRx
import {ActionReducer, ActionReducerMap, MetaReducer, StoreModule} from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment as env } from '../environments/environment';
import {appReducer, AppState} from './state/app.state';
import {EffectsModule} from '@ngrx/effects';
import {TokenInterceptorService} from './interceptors/token-interceptor.service';
import {ErrorInterceptorService} from './interceptors/error-interceptor.service';
import {AuthEffects} from './auth/state/auth.effects';
import {MessagingEffects} from './dashboard/messaging/state/messaging.effects';
import {messagingReducer} from './dashboard/messaging/state/messaging.reducer';
import {authReducer} from './auth/state/auth.reducer';
import { localStorageSync } from 'ngrx-store-localstorage';
import {DashboardModule} from './dashboard/dashboard.module';


export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: ['userCenter']})(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];


@NgModule({
    declarations: [
        AppComponent,
        LandingPageComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatDialogModule,
        ReactiveFormsModule,
        NgxEditorModule,
        ShowdownModule,
        ToastrModule.forRoot(),
        NgxEmojiPickerModule.forRoot(),
        RichTextEditorAllModule,
        BrowserAnimationsModule, // required animations module
        HttpClientModule,
        StoreModule.forRoot({userCenter: authReducer}),
        StoreDevtoolsModule.instrument({
            name: 'Oona',
            maxAge: 25,
            logOnly: env.production
        }),
        EffectsModule.forRoot([AuthEffects]),
        SharedModule,
    ],
    providers: [
        ToolbarService,
        LinkService, ImageService, HtmlEditorService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true
        },
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: ErrorInterceptorService,
        //     multi: true
        // }
    ],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
