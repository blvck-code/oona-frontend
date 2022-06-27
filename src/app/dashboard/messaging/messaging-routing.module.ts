import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndividualMessagingComponent } from './individual-messaging/individual-messaging.component';
import { MessagingComponent } from './messaging.component';
import { TeamMessagingComponent } from './team-messaging/team-messaging.component';
import {StartPageComponent} from './start-page/start-page.component';
import {AllPrivateMessagingComponent} from './all-private-messaging/all-private-messaging.component';
import {AllMentionedMessagesComponent} from './all-mentioned-messages/all-mentioned-messages.component';
import {GroupPmsComponent} from './group-pms/group-pms.component';
import {StreamsComponent} from './streams/streams.component';

const routes: Routes = [
  {
    path: '',
    component: MessagingComponent,
    children: [
      { path: '',   redirectTo: 'all', pathMatch: 'full' },
      {
        path: 'all',
        component: StartPageComponent
      },
      {
        path: 'team',
        component: TeamMessagingComponent
      },
      {
        path: 'streams/:stream',
        component: StreamsComponent
      },
      {
        path: 'streams/:stream/topic/:topic',
        component: StreamsComponent
      },
      {
        path: 'private',
        component: AllPrivateMessagingComponent
      },
      {
        path: 'mentions',
        component: AllMentionedMessagesComponent
      },
      {
        path: 'group-pm',
        component: GroupPmsComponent
      },
      {
        path: 'narrow',
        component: IndividualMessagingComponent
      }
    ]
   }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagingRoutingModule { }
