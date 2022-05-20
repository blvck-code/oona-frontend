import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-message-time-btn',
  templateUrl: './message-time-btn.component.html',
  styleUrls: ['./message-time-btn.component.scss']
})
export class MessageTimeBtnComponent implements OnInit {

  @Input() messageSectionTime: any;
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor() { }

  ngOnInit(): void {
  }

}
