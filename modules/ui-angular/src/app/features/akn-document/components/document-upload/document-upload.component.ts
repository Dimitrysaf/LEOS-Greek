import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {DIALOG_COMPONENT_CONFIG} from '@eui/components/eui-dialog';
import {EuiFileUploadComponent} from '@eui/components/eui-file-upload';
import {Subject} from 'rxjs';
import {ErrorVO} from '@/shared/models';
import {DocumentService} from '@/shared/services/document.service';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
})
export class DocumentUploadComponent implements OnInit, OnDestroy {
  @ViewChild('uploadFile') uploadEuiFile: EuiFileUploadComponent;
  uploadForm: FormGroup;
  fileName = '';
  errorsVO: ErrorVO[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isValidFile = false;
  canUploadXml = false;
  uploadedFile: File;
  private destroy$: Subject<any> = new Subject();
  private xmlExt = ".xml";
  private documentName: string | null = null;

  constructor(
    @Inject(DIALOG_COMPONENT_CONFIG) private config,
    private fb: FormBuilder,
    private documentService: DocumentService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      xmlFile: [null, Validators.required],
    });
    this.documentName = this.config.documentRef;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  closeDialog() {
    this.config?.closeDialog();
    this.resetInitials();
  }

  resetInitials() {
    this.uploadForm.reset();
    this.errorsVO = null;
    this.isValidFile = false;
  }

  onDrop() {
    if (this.uploadEuiFile.files.length > 1) {
      this.uploadEuiFile.files.shift();
      this.errorsVO = null;
    }
    this.isValidFile = false;
    this.errorsVO = [];
    this.validateXml();
  }

  uploadDocumentAction() {
    this.documentService
      .uploadDocumentWithUpdatedContent(this.getUploadedDocumentData(), this.uploadedFile)
      .subscribe(() => this.documentService.reloadDocument());
    this.closeDialog();
  }

  private validateXml() {
    const file = this.uploadEuiFile.files[0];
    if (file) {
      try {
        this.fileName = this.removeVersionFromFilename(file.name);
        if (this.fileName === this.documentName + this.xmlExt) {
          this.isValidFile = true;
          this.uploadedFile = file;
        } else {
          throw new Error(this.translate.instant('page.editor.versions.document.upload.validation.error'));
        }
      } catch (error) {
        this.isValidFile = false;
        this.errorsVO = [
          {
            errorCode: 'INVALID_XML',
            objects: [error.message],
          },
        ];
        this.uploadForm.get('xmlFile').setValue(null);
      }
      this.cdr.detectChanges();
    }
  }

  private removeVersionFromFilename(filename: string): string {
    const versionPattern = /_v\d+\.\d+\.\d+/;
    const newFilename = filename.replace(versionPattern, '');
    return newFilename;
  }

  private getUploadedDocumentData() {
    const title = this.translate.instant('page.editor.versions.document.upload.comment.title');
    const description = this.translate.instant('page.editor.versions.document.upload.comment.description');
    return {
      checkinComment: JSON.stringify({
          title,
          description,
        }),
      versionType: 'MINOR',
      documentRef: this.documentName,
    };
  }

}
