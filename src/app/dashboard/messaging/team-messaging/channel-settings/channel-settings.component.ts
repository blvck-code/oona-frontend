import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MessagingService} from '../../services/messaging.service';
import {NotificationService} from '../../../../shared/services/notification.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  streamName: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ChannelSettingsComponent>,
    private formBuilder: FormBuilder,
    private change: ChangeDetectorRef,
    private dialog: MatDialog,
    public messagingService: MessagingService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.streamName = this.data.name;
    this.messagingService.currentUserProfile().subscribe((loggedUser: any) => {
      this.loggedUserProfile = loggedUser.zulip;
    });
  }

  // tslint:disable-next-line:typedef
  submitForm(): any {
    const channelData = {
      // tslint:disable-next-line:radix
      to: this.streamName,
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
        this.dialogRef.close();
      } else {
        this.notificationService.showError(`Unable to create ${channelData.topic} at this time`, 'channel not created');
      }

    });

  }

  cancelChannelCreate(event: any): void {
    event.preventDefault();
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
