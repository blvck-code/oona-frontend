import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../../../../../shared/services/notification.service';
import {MessagingService} from '../../../services/messaging.service';
import {DashService} from '../../../../service/dash-service.service';
import {SharedService} from '../../../../../shared/services/shared.service';

@Component({
  selector: 'app-leave-team',
  templateUrl: './leave-team.component.html',
  styleUrls: ['./leave-team.component.scss']
})
export class LeaveTeamComponent implements OnInit {
  teamDetail: any;

  constructor(
    private dialog: MatDialog,
    private  notificationService: NotificationService,
    private dialogRef: MatDialogRef<LeaveTeamComponent>,
    public dashSrv: DashService,
    private sharedSrv: SharedService,
    // @ts-ignore
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.teamDetail = data.teamToLeave;
  }

  ngOnInit(): void {
  }

  cancelLeaveTeam(): void {
    this.dialogRef.close();
  }

  leaveTeam(): any {
    const streamDetail = {
      name: [
        this.teamDetail.name
      ]
    };

    this.dashSrv.unsubscribeStream(streamDetail).subscribe({
      next: (response) => {
        if (response.result === 'success'){
          this.dialogRef.close('success');
          this.sharedSrv.showNotification(`Unsubscribed from ${this.teamDetail.name}`, 'success');
        }else{
          this.sharedSrv.showNotification(`Unable to unsubscribe from ${this.teamDetail.name} at this time`, 'error');
        }
      }
    });
  }
}
