import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-individual-messaging',
  templateUrl: './individual-messaging.component.html',
  styleUrls: ['./individual-messaging.component.scss']
})
export class IndividualMessagingComponent implements OnInit {
  order: any;
  myParam: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => this.myParam = params.member);
  }

}
