import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/services/auth.service';
import {Router} from '@angular/router';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../state/app.state';
import * as authActions from '../../auth/state/auth.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  public title = 'Home';
  firstName = '';
  secondName = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.onInitPage();

    this.authService.getCurrentUser().subscribe(
      (userData: any) => {
        this.firstName = userData.results[0].first_name;
        this.secondName = userData.results[0].last_name;
        const userName = this.firstName + ` ` + this.secondName;
        this.authService.saveCurrentUserName(userName);
      }
    );
  }

  onInitPage(): void {
    this.store.dispatch(new authActions.LoadAllUsers());
    this.store.dispatch(new authActions.LoadZulipUsers());
  }

  logoutUser(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}

