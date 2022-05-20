import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/services/auth.service';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss']
})
export class ConferenceComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.isTokenExpiring()) {
      this.authService.refreshToken();
    }
  }

}
