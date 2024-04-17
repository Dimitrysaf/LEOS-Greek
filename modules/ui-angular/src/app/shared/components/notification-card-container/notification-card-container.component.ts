import { Component, OnDestroy, OnInit } from '@angular/core';
import { EuiDialogConfig, EuiDialogService } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';

import { Notification } from '../../models/notification.model';
import { NotificationsService } from '../../services/notifications.service';
import { NotificationUploadComponent } from '../notification-upload/notification-upload.component';

@Component({
  selector: 'app-notification-card-container',
  templateUrl: './notification-card-container.component.html',
  styleUrls: ['./notification-card-container.component.scss'],
})
export class NotificationCardContainerComponent implements OnInit, OnDestroy {
  notifications: Notification[];
  isNotificationsShown = false;
  canUpload = false;
  private destroy$: Subject<any> = new Subject();

  constructor(
    private notifcationService: NotificationsService,
    protected euiDialogService: EuiDialogService,
    private translateService: TranslateService,
    private appConfig: AppConfigService,
  ) {}

  ngOnInit(): void {
    this.notifcationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications) => {
        this.notifications = notifications;
      });

    this.notifcationService.isShown$.subscribe((isShown) => {
      this.isNotificationsShown = isShown;
    });
    this.setPermissions();
  }

  ngOnDestroy(): void {
    this.notifcationService.disableNotifications();
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  toggleNotificationVisibility() {
    this.notifcationService.toggleNotifications();
  }

  openNotificationUploadDialog() {
    const dialog = this.euiDialogService.openDialog(
      new EuiDialogConfig({
        dialogId: 'upload-id',
        title: this.translateService.instant('app.notification.upload.label'),
        bodyComponent: {
          component: NotificationUploadComponent,
          config: {
            closeDialog: () => this.euiDialogService.closeDialog(dialog.id),
          },
        },
        hasFooter: false,
      }),
    );
  }

  closeNotifications() {
    if (this.isNotificationsShown) {
      this.notifcationService.closeNotifications();
    }
  }

  private setPermissions() {
    //TODO change the permission once a new permission is added in the back-end for the SUPPORT role.
    this.appConfig.config.subscribe((config) => {
      const CAN_UPLOAD = config.userAppPermissions.includes('CAN_UPLOAD');
      this.canUpload = CAN_UPLOAD;
    });
  }
}
