import {Component, OnDestroy, OnInit} from '@angular/core';
import {EuiDialogConfig, EuiDialogService} from '@eui/components/eui-dialog';
import {TranslateService} from '@ngx-translate/core';
import {Subject, takeUntil} from 'rxjs';

import {AppConfigService} from '@/core/services/app-config.service';

import {Notification} from '../../models/notification.model';
import {NotificationsService} from '../../services/notifications.service';
import {NotificationUploadComponent} from '../notification-upload/notification-upload.component';
import {convertToUnixTimestamp} from '../../utils/date-utils';

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
    private notificationService: NotificationsService,
    protected euiDialogService: EuiDialogService,
    private translateService: TranslateService,
    private appConfig: AppConfigService,
  ) {}

  ngOnInit(): void {
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications) => {
        const currentTime = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds

        // Filter notifications to show only the current ones
        this.notifications = notifications.filter(notification => {
          const startTime = convertToUnixTimestamp(notification.start);
          const endTime = convertToUnixTimestamp(notification.end);
          return startTime <= currentTime && currentTime < endTime;
        });

    this.notificationService.isShown$.subscribe((isShown) => {
      this.isNotificationsShown = isShown;
    });
    this.setPermissions();
  })
  }

  ngOnDestroy(): void {
    this.notificationService.disableNotifications();
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  toggleNotificationVisibility() {
    this.notificationService.toggleNotifications();
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
      this.notificationService.closeNotifications();
    }
  }

  private setPermissions() {
    //TODO change the permission once a new permission is added in the back-end for the SUPPORT role.
    this.appConfig.config.subscribe((config) => {
      this.canUpload = config.userAppPermissions.includes('CAN_UPLOAD');
    });
  }
}
