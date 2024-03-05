import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxAppShellService } from '@eui/core';
import { parse as parseContentDisposition } from 'content-disposition-attachment';
import { apiBaseUrl } from 'src/config';

import { downloadBlob } from '../utils';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class LeosLightService {
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private uxAppShellService: UxAppShellService,
  ) {}

  exportDocument(category: string, ref: string) {
    this.loadingService.setLoading(true);

    // Export format. Support multiple formats on single call. Ex: ["PDF","LW"] will retrieve zip with PDF + zip with LW on the same call
    // YES: Include annotations on the export result. NO: exclude annotations from export result.
    const outputDescriptor = JSON.stringify({
      format: ['PDF', 'PDF_A', 'LW'],
      convertAnnotations: 'yes',
    });

    this.http
      .post(
        `${apiBaseUrl}/secured/editlight/exportDocument`,
        {
          documentUrl: `${apiBaseUrl}/secured/${category}/${ref}`,
          outputDescriptor,
        },
        {
          observe: 'response',
          responseType: 'blob',
        },
      )
      .subscribe({
        next: (response) => {
          if (response.body.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = () => {
              const json = JSON.parse(reader.result as string);
              this.uxAppShellService.growl({
                severity: 'success',
                summary: 'Result',
                detail: json && json['result'],
                sticky: true,
              });
            };
            reader.readAsText(response.body);
          } else if (response.body.type === 'application/zip') {
            const cd = parseContentDisposition(
              response.headers.get('Content-Disposition'),
            );
            const filename = cd.attachment
              ? cd.filename
              : `${category}_${ref}.zip`;
            downloadBlob(response.body, filename);
          }
        },
        error: () => {
          this.loadingService.setLoading(false);
        },
        complete: () => this.loadingService.setLoading(false),
      });
  }
}
