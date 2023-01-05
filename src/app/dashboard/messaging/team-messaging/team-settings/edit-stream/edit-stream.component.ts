import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, Validators} from '@angular/forms';
import {DashService} from '../../../../service/dash-service.service';
import {SharedService} from '../../../../../shared/services/shared.service';

interface UpdateResponse {
  zulip: {
    result: string;
    msg: string;
    code: string;
  };
  oz: {
    stream_id: number;
    stream_post_policy: number;
    is_private: boolean;
    description: string;
    new_name: string;
    history_public_to_subscribers: boolean;
  };
}

@Component({
  selector: 'app-edit-stream',
  templateUrl: './edit-stream.component.html',
  styleUrls: ['./edit-stream.component.scss']
})
export class EditStreamComponent implements OnInit {
  teamDetail: any;
  editStream = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required]
  });

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EditStreamComponent>,
    private formBuilder: FormBuilder,
    private dashSrv: DashService,
    private sharedSrv: SharedService,
    // @ts-ignore
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.teamDetail = data.editStream;
  }

  ngOnInit(): void {
    this.patchForm();
  }

  patchForm(): void {
    this.editStream.patchValue({
      name: this.teamDetail.name,
      description: this.teamDetail.description
    });
  }

  onSubmit(): void {
    const updateContent = {
      ...this.editStream.value,
      stream_id: this.teamDetail.stream_id,
      is_private: this.teamDetail.invite_only
    };

    this.dashSrv.updateStream(updateContent).subscribe({
      next: (resp: UpdateResponse) => {
        if (resp.zulip.result !== 'success') {
          // Error response
          this.sharedSrv.showNotification(resp.zulip.msg, 'error');
          return;
        }
        this.sharedSrv.showNotification('Stream updated successfully.', 'success');
      },
      error: (err: UpdateResponse) => {
        console.log('Error update stream ==>>', err);
      }
    });
  }

}
