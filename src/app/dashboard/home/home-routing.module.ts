import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import {UpcomingMeetingsComponent} from './upcoming-meetings/upcoming-meetings.component';
import {PreviousMeetingsComponent} from './previous-meetings/previous-meetings.component';
import {MeetingDetailsComponent} from './meeting-details/meeting-details.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: UpcomingMeetingsComponent
      },
      {
        path: 'previous-meetings',
        component: PreviousMeetingsComponent
      },
      {
        path: 'meeting-details/:id',
        component: MeetingDetailsComponent
      }
    ]
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
