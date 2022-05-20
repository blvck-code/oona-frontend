import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit {
  title = 'Team messaging';
  navTitle = '';
  firstName = '';
  secondName = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.authService.getCurrentUser().subscribe(
      (userData: any) => {
        this.firstName = userData.results[0].first_name;
        this.secondName = userData.results[0].last_name;
      }
    );

    this.route.queryParams
      .subscribe(params => {
        if (params.member || window.location.href.includes('private')){
          this.navTitle = 'Private messaging';
        }else if (window.location.href.includes('mentions')){
          this.navTitle = 'Messaging';
        } else{
          this.navTitle = 'Team messaging';
        }
        }
      );
  }

  logoutUser(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
