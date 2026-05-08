import { Component, output, viewChild, ChangeDetectionStrategy, ChangeDetectorRef, inject, OnInit, OnDestroy } from '@angular/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { EuiDialogComponent, EuiDialogService, EuiDialogModule } from '@eui/components/eui-dialog';
import { EuiButtonModule } from '@eui/components/eui-button';
import { DocumentService } from '@/shared/services/document.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-document-preview',
  templateUrl: './document-preview.component.html',
  imports: [NgxExtendedPdfViewerModule, EuiButtonModule, EuiDialogModule],
  providers: [
    EuiDialogService,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentPreviewComponent implements OnInit, OnDestroy {
  filepathNeme: string | Blob = null;

  readonly dialog = viewChild<EuiDialogComponent>('dialog');
  readonly dialogOpen = output<boolean>();

  private documentService = inject(DocumentService);
  private destroy$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.documentService.openPreviewDialog$
      .pipe(takeUntil(this.destroy$))
      .subscribe((shouldOpen) => {
        if (shouldOpen) {
          this.openDialog();
          this.documentService.resetOpenPreviewDialog();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public openDialog(): void {
    const cachedBlob = this.documentService.getCachedPreview();

    if (cachedBlob) {
      this.filepathNeme = cachedBlob;
      this.dialogOpen.emit(true);
      this.dialog().openDialog();
      this.cdr.detectChanges();
    }
  }

  onClose() {
    this.dialogOpen.emit(false);
    this.filepathNeme = null;
  }

}
