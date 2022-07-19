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
import {RichTextEditorAllModule} from '@syncfusion/ej2-angular-richtexteditor';
import {MatDialogModule} from '@angular/material/dialog';
import {NgxEmojiPickerModule} from 'ngx-emoji-picker';
import {ShowdownModule} from 'ngx-showdown';

// NgRx
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment as env } from '../environments/environment';
import { appReducer } from './state/app.state';
import {EffectsModule} from '@ngrx/effects';
import {TokenInterceptorService} from './interceptors/token-interceptor.service';
import {ErrorInterceptorService} from './interceptors/error-interceptor.service';

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
        StoreModule.forRoot(appReducer),
        StoreDevtoolsModule.instrument({
            name: 'Oona',
            maxAge: 25,
            logOnly: env.production
        }),
        EffectsModule.forRoot([]),
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptorService,
            multi: true
        }
    ],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
