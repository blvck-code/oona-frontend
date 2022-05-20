import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { FullCalendarModule} from '@fullcalendar/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HomeComponent } from './home.component';
import { UpcomingMeetingsComponent } from './upcoming-meetings/upcoming-meetings.component';
import { PreviousMeetingsComponent } from './previous-meetings/previous-meetings.component';
import { MeetingDetailsComponent } from './meeting-details/meeting-details.component';
import { SearchPipe} from './shared/pipes/filter.pipe';
import {HighlightDirective} from './shared/directives/highlight.directive';
import { LoadIndicatorComponent } from './shared/load-indicator/load-indicator.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    HomeComponent,
    UpcomingMeetingsComponent,
    PreviousMeetingsComponent,
    MeetingDetailsComponent,
    HighlightDirective,
    SearchPipe,
    SearchPipe,
    LoadIndicatorComponent
  ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        FullCalendarModule,
        SharedModule
    ]
})
export class HomeModule { }
