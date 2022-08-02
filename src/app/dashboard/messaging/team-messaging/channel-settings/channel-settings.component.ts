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
  streamId:any;

  constructor(
    private dialogRef: MatDialogRef<ChannelSettingsComponent>,
    private formBuilder: FormBuilder,
    private change: ChangeDetectorRef,
    private dialog: MatDialog,
    public messagingService: MessagingService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.streamId = localStorage.getItem('str');
    this.messagingService.currentUserProfile().subscribe((loggedUser: any) => {
      this.loggedUserProfile = loggedUser.zulip;
    });
  }

  // tslint:disable-next-line:typedef
  submitForm(): any {
    const channelData = {
      // tslint:disable-next-line:radix
      to: this.streamId,
      type: 'stream',
      topic: this.channelForm.value.channelName,
      content: this.channelForm.value.channelDescription,
      // Todo add more members here. Automatically add current logged in user
      // user_id: [this.loggedUserProfile.email]
    };

    this.messagingService.createChannel(channelData).subscribe((response: any) => {
      console.log('My response', response);
      if (response['zulip message'].result === 'success') {
        this.dialogRef.close('success');
        this.notificationService.showSuccess(`channel ${channelData.topic} created`, 'channel created');
      } else {
        this.notificationService.showError(`Unable to create ${channelData.topic} at this time`, 'channel not created');
      }

    });

  }

  cancelChannelCreate(): void {
    this.dialogRef.close();
  }

  isSubmitted(): any {
    if (!this.channelForm.valid) {
      this.emptyForm = true;
    } else {
      this.submitForm();

    }
  }

  get channelFormControls(): any {
    return this.channelForm.controls;
  }
}
