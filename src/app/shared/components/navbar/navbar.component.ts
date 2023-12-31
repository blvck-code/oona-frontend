import {Component, Inject, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../auth/services/auth.service';
import {Router} from '@angular/router';

// NgRx
import {Store} from '@ngrx/store';
import {AppState} from '../../../state/app.state';
import {getUserDetails, getZulipProfile, getZulipProfileInfo} from '../../../auth/state/auth.selectors';
import {Observable} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {SharedService} from '../../services/shared.service';
import {BROWSER_STORAGE} from '../../../auth/storage';
import {OonaSocketService} from '../../../dashboard/messaging/services/oona-socket.service';
import * as authActions from '../../../auth/state/auth.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userDetails$: Observable<any> = this.store.select(getUserDetails);
  currentUser$: Observable<any> = this.store.select(getZulipProfileInfo);

  @Input() public parentTitle!: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private oonaSockets: OonaSocketService,
    private sharedSrv: SharedService,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) { }

  ngOnInit(): void {
  }


  logoutUser(): void {
    // this.store.dispatch(new authActions.LogoutUser());
    // console.log('logout')
    this.authService.logout().subscribe({
      next: () => {
        this.storage.removeItem('ot');
        this.storage.removeItem('or');
        this.storage.removeItem('u?');
        localStorage.clear();
        this.router.navigate(['/']);
        this.store.dispatch(new authActions.LogoutUserSuccess());
        this.oonaSockets.disconnect();
        this.sharedSrv.showNotification('Logout successful.', 'success');
      },
      error: () => {
        this.sharedSrv.showNotification('Logged out failed.', 'error');
      }
    });
  }

}
