import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../auth/services/auth.service';
import {Router} from '@angular/router';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../state/app.state';
import * as authActions from '../../../auth/state/auth.actions'
import {getUserDetails} from '../../../auth/state/auth.selectors';
import {Observable} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userDetails$!: Observable<any>;
  @Input() public parentTitle!: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void{
    this.userDetails$ = this.store.select(getUserDetails);
  }

  logoutUser(): void {
    // this.store.dispatch(new authActions.LogoutUser());
    // console.log('logout')
    this.authService.logout();
    this.router.navigate(['/']);
    this.toastr.success('Logout successful.', 'Notification');
  }

}
