import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxAppShellService } from '@eui/core';
import { parse as parseContentDisposition } from 'content-disposition-attachment';
import { apiBaseUrl } from 'src/config';

import { downloadBlob } from '../utils';
import { LoadingService } from './loading.service';
import { DocumentConfig } from "@/shared";
import { EuiDialogService } from "@eui/components/eui-dialog";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root',
})
export class LeosLightService {
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private uxAppShellService: UxAppShellService,
    private dialogService: EuiDialogService,
    private translateService: TranslateService,
  ) {}

  exportDocument(category: string, ref: string, documentConfig: DocumentConfig) {
    const documentMetadata = documentConfig?.documentsMetadata?.find(d => d.category = category);

    if(documentMetadata?.callbackAddress === null || documentMetadata?.callbackAddress === '') {
      this.dialogService.openDialog({
        title: this.translateService.instant('dialog.leos.light.mark.as.done.title'),
        content: this.translateService.instant('dialog.leos.light.mark.as.done.content'),
        accept: () => {
          this.export(category, ref);
        },
      });
    } else {
      this.export(category, ref);
    }
  }

  private export(category: string, ref: string) {
    this.loadingService.setLoading(true);

    this.http
      .post(
        `${apiBaseUrl}/secured/leos-light/export-document`,
        {
          documentUrl: `${apiBaseUrl}/secured/${category}/${ref}`
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
            const cd = parseContentDisposition(response.headers.get('Content-Disposition'));
            const filename = cd.attachment ? cd.filename : `${category}_${ref}.zip`;
            downloadBlob(response.body, filename);
          } else if (response.body.type === 'application/xml') {
            const cd = parseContentDisposition(response.headers.get('Content-Disposition'));
            const filename = cd.attachment ? cd.filename : `${category}_${ref}.xml`;
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
