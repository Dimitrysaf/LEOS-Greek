import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { apiBaseUrl } from 'src/config';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private isShownBS: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  isShown$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isShown$ = this.isShownBS.asObservable();
  }

  fetchNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${apiBaseUrl}/secured/home/fetchNotifications`,
    );
  }

  disableNotifications() {
    this.isShownBS.next(false);
  }

  toggleNotifications(): void {
    this.isShownBS.next(!this.isShownBS.value);
  }
}
