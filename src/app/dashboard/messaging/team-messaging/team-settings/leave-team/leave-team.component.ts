import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../../../../../shared/services/notification.service';
import {MessagingService} from '../../../messaging.service';

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
    public messagingService: MessagingService,
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

    this.messagingService.unsubscribeFromStream(streamDetail).subscribe((response: any) => {

      if (response.result === 'success'){
        this.dialogRef.close('success');
        this.notificationService.showSuccess(`Unsubscribed from ${this.teamDetail.name}`, 'Unsubscribed successfully');
      }else{
        this.notificationService.showError(`Unable to unsubscribe from ${this.teamDetail.name} at this time`, 'Could not unsubscribe');
      }
    });
  }
}
