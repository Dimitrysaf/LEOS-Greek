import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  tap
} from 'rxjs';
import { apiBaseUrl } from 'src/config';

import { Document } from '@/shared';

import { PackagesFavourite } from '../models/packages-favourite.model';
import { PackagesRecentlyChanged } from '../models/packages-recent-changed.model';
import { IS_ERROR_INTERCEPTION_ENABLED } from "@/core/services/error-handler.interceptor";

@Injectable({
  providedIn: 'root',
})
export class LandingPageService {
  isNotificationShown$: Observable<boolean>;
  isFavourite$: Observable<boolean>;
  private isNotificationShownBS = new BehaviorSubject<boolean>(true);

  private isFavouriteBS = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.isNotificationShown$ = this.isNotificationShownBS.asObservable();
    this.isFavourite$ = this.isFavouriteBS.asObservable();
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
    return this.http.get<Document>(`${apiBaseUrl}/secured/proposals/${pkg}`,
      { context: new HttpContext().set(IS_ERROR_INTERCEPTION_ENABLED, (err) => !err.status) });
  }

  checkAndUpdateFavouriteStatus(packageRef: string): Observable<boolean> {
    return this.findFavouritePackagesForUser().pipe(
      map((favouritePackages) =>
        favouritePackages.some((pkg) => pkg.ref === packageRef),
      ),
      tap((isFavourite) => this.isFavouriteBS.next(isFavourite)),
    );
  }

  toggleFavouritePackage(documentRef: string): Observable<boolean> {
    return this.http
      .put<PackagesFavourite>(
        `${apiBaseUrl}/secured/home/${documentRef}/toggle-favourite-package`,
        {},
      )
      .pipe(
        tap((response) => {
          this.updateFavouriteStatus(response.isFavourite);
        }),
        map((response) => response.isFavourite),
      );
  }

  toggleNotifications() {
    const currentValue = this.isNotificationShownBS.getValue();
    this.isNotificationShownBS.next(!currentValue);
  }

  updateFavouriteStatus(newStatus: boolean) {
    this.isFavouriteBS.next(newStatus);
  }
}
