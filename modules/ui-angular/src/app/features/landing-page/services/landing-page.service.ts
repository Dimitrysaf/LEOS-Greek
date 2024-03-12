import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from 'src/config';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { PackagesRecentlyChanged } from '../models/packages-recent-changed.model';

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
}
