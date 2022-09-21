import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent implements OnInit {
  @Input() allUsers$!: Observable<any>;
  @Input() userContent!: string;
  @Output() rightPanelEvent = new EventEmitter<string>();

  constructor(
  ) { }

  ngOnInit(): void {
    this.defaultUser();
  }

  defaultUser(): void {
    if (!this.userContent) {
      this.userContent = 'all_users';
    }
  }

  rightPanelTypeListener($event: any): void {
    this.rightPanelEvent.emit('individual_user');
  }

}
