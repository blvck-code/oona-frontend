import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminTagComponent } from './components/admin-tag/admin-tag.component';
import { GuestTagComponent } from './components/guest-tag/guest-tag.component';
import { ActiveTagComponent } from './components/active-tag/active-tag.component';
import { InactiveTagComponent } from './components/inactive-tag/inactive-tag.component';
import { IdleTagComponent } from './components/idle-tag/idle-tag.component';
import { TypingComponent } from './components/typing/typing.component';
import { NavbarComponent } from './components/navbar/navbar.component';

// NgRx
import {StoreModule} from '@ngrx/store';
import {sharedReducer} from './state/shared.reducer';
import {sharedSelectors} from './state/shared.selectors';
import {EffectsModule} from '@ngrx/effects';
import {SharedEffects} from './state/shared.effects';



@NgModule({
  // tslint:disable-next-line:max-line-length
    declarations: [
      AdminTagComponent,
      GuestTagComponent,
      ActiveTagComponent,
      InactiveTagComponent,
      IdleTagComponent,
      TypingComponent,
      NavbarComponent
    ],
    exports: [
        AdminTagComponent,
        GuestTagComponent,
        ActiveTagComponent,
        InactiveTagComponent,
        IdleTagComponent,
        TypingComponent,
        NavbarComponent
    ],
  imports: [
    CommonModule,
    StoreModule.forFeature(sharedSelectors, sharedReducer),
    EffectsModule.forFeature([SharedEffects])
  ]
})
export class SharedModule { }
