import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MessagingService} from '../../services/messaging.service';
import {NotificationService} from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-channel-settings',
  templateUrl: './channel-settings.component.html',
  styleUrls: ['./channel-settings.component.scss']
})
export class ChannelSettingsComponent implements OnInit {
  channelForm = this.formBuilder.group({
    channelName: ['', Validators.required],
    channelDescription: ['', Validators.required],
  });
  emptyForm = false;
  private loggedUserProfile: any;

  constructor(
    private dialogRef: MatDialogRef<ChannelSettingsComponent>,
    private formBuilder: FormBuilder,
    private change: ChangeDetectorRef,
    private dialog: MatDialog,
    public messagingService: MessagingService,
    private  notificationService: NotificationService

  ) {
  }

  ngOnInit(): void {
    this.messagingService.currentUserProfile().subscribe((loggedUser: any) => {
      this.loggedUserProfile = loggedUser.zulip;
    });
  }

  // tslint:disable-next-line:typedef
  submitForm(): any {
    const channelData = {
      name: this.channelForm.value.channelName,
      description: this.channelForm.value.channelDescription,
      // Todo add more members here. Automatically add current logged in user
      user_id: [this.loggedUserProfile.email]
    };

    this.messagingService.createChannel(channelData).subscribe((response: any) => {
      if (response['zulip message'].result === 'success') {
        this.dialogRef.close('success');
        this.notificationService.showSuccess(`channel ${channelData.name} created`, 'channel created');
      } else {
        this.notificationService.showError(`Unable to create ${channelData.name} at this time`, 'channel not created');
      }

    });

  }

  cancelChannelCreate(): void {
    this.dialogRef.close();
  }

  isSubmitted(): any {
    if (!this.channelForm.valid) {
      this.emptyForm = true;
    }else {
      this.submitForm();

    }
  }

  get channelFormControls(): any {
    return this.channelForm.controls;
  }
}
