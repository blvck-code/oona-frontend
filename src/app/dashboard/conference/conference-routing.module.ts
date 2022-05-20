import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConferenceComponent } from './conference.component';
import {OonaIframeComponent} from './oona-iframe/oona-iframe.component';
import {PreJoinComponent} from './pre-join/pre-join.component';

const routes: Routes = [
  {
    path: '',
    component: ConferenceComponent,
    children: [
      {
        path: '',
        component: OonaIframeComponent
      },
      {
        path: 'pre-join',
        component: PreJoinComponent
      }
    ]
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConferenceRoutingModule { }
