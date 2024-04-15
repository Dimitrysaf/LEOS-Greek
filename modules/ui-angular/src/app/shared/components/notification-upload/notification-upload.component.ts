import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DIALOG_COMPONENT_CONFIG } from '@eui/components/eui-dialog';
import { EuiFileUploadComponent } from '@eui/components/eui-file-upload';
import { TranslateService } from '@ngx-translate/core';

import { ErrorVO } from '@/shared/models';
import { NotificationsService } from '@/shared/services/notifications.service';

export const REQUIRED_FIELDS: string[] = [
  'start',
  'end',
  'newsTimestamp',
  'title',
  'body',
];
@Component({
  selector: 'app-notification-upload',
  templateUrl: './notification-upload.component.html',
  styleUrls: ['./notification-upload.component.scss'],
})
export class NotificationUploadComponent implements OnInit {
  @ViewChild('uploadFile') uploadEuiFile: EuiFileUploadComponent;
  uploadForm: FormGroup;

  fileName = '';
  errorsVO: ErrorVO[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isValidFile = false;
  private validJson: any = null;
  constructor(
    @Inject(DIALOG_COMPONENT_CONFIG) private config,
    private fb: FormBuilder,
    public translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationsService,
  ) {}

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      jsonFile: [null, Validators.required],
    });
  }

  closeDialog() {
    this.config?.closeDialog();
    this.resetInitials();
  }

  resetInitials() {
    this.uploadForm.reset();
    this.errorsVO = null;
    this.isValidFile = false;
  }

  onDrop() {
    if (this.uploadEuiFile.files.length > 1) {
      this.uploadEuiFile.files.shift();
      this.errorsVO = null;
    }
    this.isValidFile = false;
    this.errorsVO = [];
    this.fileName = '';

    this.validateJson();
  }

  uploadNotifications(): void {
    this.notificationService.uploadNotifications(this.validJson).subscribe({
      next: (response) => {
        this.successMessage = 'Notifications uploaded successfully!';
        this.closeDialog();
      },
      error: (error) => {
        this.errorMessage = 'Failed to upload notifications.';
        console.error('Upload error:', error);
      },
    });
  }

  private validateJson() {
    const file = this.uploadEuiFile.files[0];
    if (file) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          this.validJson = JSON.parse(e.target.result as string);
          if (Array.isArray(this.validJson)) {
            this.validJson.forEach((jsonObject, index) => {
              if (!this.validateJsonStructure(jsonObject)) {
                throw new Error(
                  `Invalid JSON structure or date format in array index ${index}`,
                );
              }
            });
            this.errorsVO = [];
            this.isValidFile = true;
          } else {
            throw new Error('Expected an array of JSON objects');
          }
        } catch (error) {
          this.isValidFile = false;
          this.errorsVO = [
            {
              errorCode: 'INVALID_JSON_FORMAT',
              objects: [error.message],
            },
          ];
          this.uploadForm.get('jsonFile').setValue(null);
        }
        this.cdr.detectChanges();
      };
      reader.readAsText(file);
    }
  }

  private validateJsonStructure(json: any): boolean {
    this.errorsVO = [];

    REQUIRED_FIELDS.forEach((field) => {
      if (!(field in json)) {
        this.errorsVO.push({
          errorCode: 'MISSING_FIELD',
          objects: [`${field} is missing in JSON object`],
        });
      }
    });

    return this.errorsVO.length === 0;
  }
}
