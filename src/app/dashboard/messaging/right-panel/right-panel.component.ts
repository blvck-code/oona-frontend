import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent implements OnInit {
  @Input() allUsers$!: Observable<any>;
  @Input() userContent!: string;

  constructor(
  ) { }

  ngOnInit(): void {
    this.defaultUser();
    this.allUsers$.subscribe(
      users => console.log('Hell yeah ===>>>', users)
    );
  }

  defaultUser(): void {
    if (!this.userContent) {
      this.userContent = 'all_users';
    }
  }

}
