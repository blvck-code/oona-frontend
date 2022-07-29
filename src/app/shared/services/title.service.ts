import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.getCurrentRoute();
  }

  getCurrentRoute(): void {
    // @ts-ignore
    this.router.events.subscribe((event: Event) => {
      console.log('Current route event ===>>>', event);
    });
  }
}
