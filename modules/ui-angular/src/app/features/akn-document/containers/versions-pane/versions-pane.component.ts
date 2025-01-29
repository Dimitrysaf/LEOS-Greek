import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Version } from '@/features/akn-document/models';
import { DocumentService } from '@/shared/services/document.service';

@Component({
  selector: 'app-versions-pane',
  templateUrl: './versions-pane.component.html',
  styleUrls: ['./versions-pane.component.scss'],
})
export class VersionsPaneComponent implements OnInit {
  @Output() exploreMilestone = new EventEmitter<Version>();

  protected hasMore = false;
  protected versions: Version[] = [];
  protected showMoreLabel: string;
  private totalNumVersions = 0;
  private semaphore = true;

  constructor(
    public doc: DocumentService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.showMoreLabel = this.translate.instant(
      'page.editor.versions.modifications-show',
    );
    this.initVersions();
  }

  initVersions() {
    const self = this;
    this.semaphore = false;
    this.doc.versions$.subscribe((recVersions: Version[]) => {
      self.versions = [...recVersions];
      self.hasMore = self.versions.length < self.totalNumVersions;
      self.semaphore = true;
      self.doc.totalNumVersion$.subscribe((numVersions: number) => {
        self.totalNumVersions = numVersions;
        self.hasMore = self.versions.length < self.totalNumVersions;
      });
    });
  }

  updateVersions() {
    const self = this;
    this.semaphore = false;
    this.doc
      .getDocumentVersionsData(
        this.doc.documentType,
        this.doc.documentRef,
        Math.floor(this.versions.length / this.doc.pageSize),
        this.doc.pageSize,
      )
      .subscribe((recVersions: Version[]) => {
        self.versions = [...self.versions, ...recVersions];
        self.hasMore = self.versions.length < self.totalNumVersions;
        self.semaphore = true;
      });
  }

  protected toggleShowMore() {
    if (this.hasMore && this.semaphore) {
      this.updateVersions();
    }
  }

  protected isVersionArchived(version: Version): boolean {
    return version.versionArchived;
  }
}
