import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { apiBaseUrl } from 'src/config';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { PackagesRecentlyChanged } from '../models/packages-recent-changed.model';
import { PackagesFavourite } from '../models/packages-favourite.model';
import { Document } from '@/shared';

@Injectable({
  providedIn: 'root',
})
export class LandingPageService {
  isNotificationShown$: Observable<boolean>;
  private isNotificationShownBS = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient) {
    this.isNotificationShown$ = this.isNotificationShownBS.asObservable();
  }

  findRecentPackagesForUser(): Observable<PackagesRecentlyChanged[]> {
    return this.http.get<PackagesRecentlyChanged[]>(
      `${apiBaseUrl}/secured/home/my-recent-packages`,
    );
  }

  findFavouritePackagesForUser(): Observable<PackagesFavourite[]> {
    return this.http.get<PackagesFavourite[]>(
      `${apiBaseUrl}/secured/home/my-favourite-packages`,
    );
  }

  getUserDoc(pkg: PackagesRecentlyChanged): Observable<Document> {
    return this.http.get<Document>(`${apiBaseUrl}/secured/proposals/${pkg}`);
  }

  toggleNotifications() {
    const currentValue = this.isNotificationShownBS.getValue();
    this.isNotificationShownBS.next(!currentValue);
  }
}
