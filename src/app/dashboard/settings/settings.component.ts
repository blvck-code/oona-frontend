import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/services/auth.service';
import {Router} from '@angular/router';
import {UserData} from './shared/user-data';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  title = 'Settings';
  firstName = '';
  secondName = '';
  userEmail = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (userData: any) => {
        this.firstName = userData.results[0].first_name;
        this.secondName = userData.results[0].last_name;
        const userName = this.firstName + ` ` + this.secondName;
        this.userEmail = userData.results[0].email;
        this.authService.saveCurrentUserName(userName);
      }
    );
  }

  logoutUser(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
