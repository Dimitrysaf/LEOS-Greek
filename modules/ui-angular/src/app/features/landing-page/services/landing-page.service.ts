import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from 'src/config';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { PackagesRecentlyChanged } from '../models/packages-recent-changed.model';
import { PackagesFavourite } from '../models/packages-favourite.model';

@Injectable({
  providedIn: 'root',
})
export class LandingPageService {
  constructor(private http: HttpClient) {}

  findRecentPackagesForUser(): Observable<PackagesRecentlyChanged[]> {
    return this.http.get<PackagesRecentlyChanged[]>(
      `${apiBaseUrl}/secured/home/my-recent-packages`,
    );
  }

  findFavouritePackagesForUser(): Observable<PackagesFavourite[]> {
    return this.http.get<PackagesFavourite[]>(
      `${apiBaseUrl}/secured/home/my-favorite-packages`,
    );
  }
}
