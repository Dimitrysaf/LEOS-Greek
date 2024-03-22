import { AppConfigService } from '@/core/services/app-config.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { Notification } from '../../models/notification.model';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-notification-card-container',
  templateUrl: './notification-card-container.component.html',
  styleUrls: ['./notification-card-container.component.scss'],
})
export class NotificationCardContainerComponent implements OnInit, OnDestroy {
  isNotificationsShown: boolean = false;
  notifications: Notification[] = [
    {
      start: '2024-03-21T09:00:00Z',
      end: '2024-03-21T11:00:00Z',
      newsTimestamp: 1711018559,
      title: 'Notification 1',
      body: 'This is the body of notification 1.',
    },
    {
      start: '2024-03-22T09:00:00Z',
      end: '2024-03-22T11:00:00Z',
      newsTimestamp: 1711104959,
      title: 'Notification 2',
      body: 'This is the body of notification 2.',
    },
    {
      start: '2024-03-23T09:00:00Z',
      end: '2024-03-23T11:00:00Z',
      newsTimestamp: 1711191359,
      title: 'Notification 3',
      body: 'This is the body of notification 3.',
    },
    {
      start: '2024-03-22T11:08:55Z',
      end: '2024-03-22T13:08:55Z',
      newsTimestamp: 1711135735,
      title: 'Notification Short',
      body: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ',
    },
    {
      start: '2024-03-23T11:08:55Z',
      end: '2024-03-23T13:08:55Z',
      newsTimestamp: 1711092135,
      title: 'Notification Medium',
      body: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ip',
    },
    {
      start: '2024-03-24T11:08:55Z',
      end: '2024-03-24T13:08:55Z',
      newsTimestamp: 1711223535,
      title: 'Notification Long',
      body: 'Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ip',
    },
  ];

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
    //This will be uncommented when the BE endpoints get implemented.
    // this.notifcationService.fetchNotifications().subscribe((notifications) => {
    //   this.notifications = notifications;
    // });
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

  private setPermissions() {
    //TODO change the permission once a new permission is added in the back-end for the SUPPORT role.
    this.appConfig.config.subscribe((config) => {
      const CAN_UPLOAD = config.userAppPermissions.includes('CAN_UPLOAD');
      this.canUpload = CAN_UPLOAD;
    });
  }
}
