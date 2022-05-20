import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConferenceRoutingModule } from './conference-routing.module';
import { ConferenceComponent } from './conference.component';
import { OonaIframeComponent } from './oona-iframe/oona-iframe.component';
import { PreJoinComponent } from './pre-join/pre-join.component';


@NgModule({
  declarations: [ConferenceComponent, OonaIframeComponent, PreJoinComponent],
  imports: [
    CommonModule,
    ConferenceRoutingModule
  ]
})
export class ConferenceModule { }
