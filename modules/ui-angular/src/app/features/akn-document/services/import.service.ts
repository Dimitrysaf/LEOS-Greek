import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiBaseUrl } from 'src/config';

import { DocType } from '@/features/akn-document/models/import.model';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  constructor(private http: HttpClient) {}

  searchForImport(params: {
    documentRef: string;
    type: DocType;
    year: number;
    number: number;
  }) {
    const { documentRef, ...body } = params;
    return this.http.put(
      `${apiBaseUrl}/secured/bill/${documentRef}/search-for-import`,
      body,
      { responseType: 'text' },
    );
  }

  importElements(params: {
    documentRef: string;
    type: DocType;
    year: number;
    number: number;
    elementIds: string[];
  }) {
    const { documentRef, ...body } = params;
    return this.http.put(
      `${apiBaseUrl}/secured/bill/${documentRef}/import-elements`,
      body,
      { responseType: 'text' },
    );
  }
}
