import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { apiBaseUrl } from 'src/config';

import { Document } from '@/shared';

import { PackagesFavourite } from '../models/packages-favourite.model';
import { PackagesRecentlyChanged } from '../models/packages-recent-changed.model';

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
    return this.http.get<Document>(`${apiBaseUrl}/secured/proposals/${pkg}`);
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
