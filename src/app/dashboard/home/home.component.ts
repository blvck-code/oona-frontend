import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/services/auth.service';
import {Router} from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (userData: any) => {
        this.firstName = userData.results[0].first_name;
        this.secondName = userData.results[0].last_name;
        const userName = this.firstName + ` ` + this.secondName;
        this.authService.saveCurrentUserName(userName);
      }
    );
  }

  logoutUser(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
