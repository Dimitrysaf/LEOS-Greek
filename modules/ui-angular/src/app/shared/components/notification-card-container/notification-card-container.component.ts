import { AppConfigService } from '@/core/services/app-config.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EuiDialogConfig, EuiDialogService } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { Notification } from '../../models/notification.model';
import { NotificationsService } from '../../services/notifications.service';
import { NotificationUploadComponent } from '../notification-upload/notification-upload.component';

export const NOTIFICATIONS: Notification[] = [
  {
    start: 1711018559,
    end: 1711022159,
    newsTimestamp: 1711018559,
    title: 'Notification 1',
    body: 'This is the body of notification 1.',
  },
  {
    start: 1711104959,
    end: 1711108559,
    newsTimestamp: 1711104959,
    title: 'Notification 2',
    body: 'This is the body of notification 2.',
  },
  {
    start: 1711191359,
    end: 1711194959,
    newsTimestamp: 1711191359,
    title: 'Notification 3',
    body: 'This is the body of notification 3.',
  },
  {
    start: 1711135735,
    end: 1711139335,
    newsTimestamp: 1711135735,
    title: 'Notification Short',
    body: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ',
  },
  {
    start: 1711092135,
    end: 1711095735,
    newsTimestamp: 1711092135,
    title: 'Notification Medium',
    body: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ip',
  },
  {
    start: 1711223535,
    end: 2147483647,
    newsTimestamp: 1711223535,
    title: 'Notification Long',
    body: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ip',
  },
];

@Component({
  selector: 'app-notification-card-container',
  templateUrl: './notification-card-container.component.html',
  styleUrls: ['./notification-card-container.component.scss'],
})
export class NotificationCardContainerComponent implements OnInit, OnDestroy {
  isNotificationsShown: boolean = false;
  notifications: Notification[] = NOTIFICATIONS;
  private destroy$: Subject<any> = new Subject();
  canUpload = false;
  constructor(
    private notifcationService: NotificationsService,
    protected euiDialogService: EuiDialogService,
    private translateService: TranslateService,
    private appConfig: AppConfigService,
  ) {}

  ngOnInit(): void {
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

  private setPermissions() {
    //TODO change the permission once a new permission is added in the back-end for the SUPPORT role.
    this.appConfig.config.subscribe((config) => {
      const CAN_UPLOAD = config.userAppPermissions.includes('CAN_UPLOAD');
      this.canUpload = CAN_UPLOAD;
    });
  }
}
