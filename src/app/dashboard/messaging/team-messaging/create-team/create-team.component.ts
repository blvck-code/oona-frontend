import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MessagingService} from '../../messaging.service';
import {FormBuilder, Validators} from '@angular/forms';
import {NotificationService} from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
export class CreateTeamComponent implements OnInit {

  teamForm = this.formBuilder.group({
    teamName: ['', Validators.required],
    teamDescription: ['', Validators.required],
  });
  emptyForm = false;
  private loggedUserProfile: any;

  constructor(
    private dialogRef: MatDialogRef<CreateTeamComponent>,
    public messagingService: MessagingService,
    private formBuilder: FormBuilder,
    private  notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.messagingService.currentUserProfile().subscribe((loggedUser: any) => {
      this.loggedUserProfile = loggedUser.zulip;
    });
  }

  cancelTeamCreate(): void {
    this.dialogRef.close();
  }

  submitForm(): any {
    const teamData = {
      name: this.teamForm.value.teamName,
      description: this.teamForm.value.teamDescription,
      // Todo add more members here. Automatically add current logged in user
      user_id: [this.loggedUserProfile.email]
    };

    this.messagingService.createTeam(teamData).subscribe((response: any) => {
      if (response['zulip message'].result === 'success'){
          this.dialogRef.close('success');
          this.notificationService.showSuccess(`Team ${teamData.name} created`, 'Team created');
          }else{
            this.notificationService.showError(`Unable to create ${teamData.name} at this time`, 'Team not created');
          }

    });
  }

  isSubmitted(): any {
    if (!this.teamForm.valid) {
      this.emptyForm = true;
    }else {
      this.submitForm();

    }
  }

  get teamFormControls(): any {
    return this.teamForm.controls;
  }
}
