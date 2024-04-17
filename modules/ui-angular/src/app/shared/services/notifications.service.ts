import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { apiBaseUrl } from 'src/config';

import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  isShown$: Observable<boolean>;
  notifications$: Observable<Notification[]>;
  private isShownBS: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  private notificationsBS = new BehaviorSubject<Notification[]>([]);

  constructor(private http: HttpClient) {
    this.isShown$ = this.isShownBS.asObservable();
    this.notifications$ = this.notificationsBS.asObservable();
  }

  fetchNotifications(): Observable<Notification[]> {
    this.http
      .get<Notification[]>(`${apiBaseUrl}/secured/home/fetchNotifications`)
      .subscribe((data) => {
        this.notificationsBS.next(data);
      });
    return this.notificationsBS.asObservable();
  }

  uploadNotifications(
    notifications: Notification[],
  ): Observable<Notification[]> {
    return this.http.post<Notification[]>(
      `${apiBaseUrl}/secured/home/uploadNotifications`,
      notifications,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      },
    );
  }

  disableNotifications() {
    this.isShownBS.next(false);
  }

  toggleNotifications(): void {
    this.isShownBS.next(!this.isShownBS.value);
  }

  closeNotifications() {
    this.isShownBS.next(false);
  }
}
