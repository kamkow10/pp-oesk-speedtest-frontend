import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() public text = '';
  @Input() public alertType: AlertType = "warning";

  constructor() {
  }

  ngOnInit(): void {
  }

}

export declare type AlertType = 'warning' | 'success' | 'error';
