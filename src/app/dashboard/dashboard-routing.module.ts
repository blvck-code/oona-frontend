import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'calls/:id',
        loadChildren: () =>
          import('./conference/conference.module').then(
            (m) => m.ConferenceModule
          ),
      },
      {
        path: 'messaging',
        loadChildren: () =>
          import('./messaging/messaging.module').then((m) => m.MessagingModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: 'messages',
        loadChildren: () =>
          import('./messages/messages.module').then((m) => m.MessagesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
