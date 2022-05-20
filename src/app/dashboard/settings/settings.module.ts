import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [SettingsComponent, UserSettingsComponent],
    imports: [
        CommonModule,
        SettingsRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class SettingsModule { }
