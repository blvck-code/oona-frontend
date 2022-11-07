import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {SharedModule} from '../shared/shared.module';
import {StoreModule} from '@ngrx/store';
import {messagingReducer} from './messaging/state/messaging.reducer';
import {EffectsModule} from '@ngrx/effects';
import {MessagingEffects} from './messaging/state/messaging.effects';
import {dashReducer} from './state/dash.reducer';


@NgModule({
  declarations: [DashboardComponent],
  exports: [

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    StoreModule.forFeature('dashboard', dashReducer),
    EffectsModule.forFeature([MessagingEffects])
  ]
})
export class DashboardModule { }
