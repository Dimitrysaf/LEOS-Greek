import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { orderBy } from 'lodash-es';
import { Observable, of } from 'rxjs';

import { Version } from '@/features/akn-document/models/versions';
import { DocumentService } from '@/shared/services/document.service';

@Component({
  selector: 'app-search-versions-pane',
  templateUrl: './search-versions-pane.component.html',
  styleUrls: ['./search-versions-pane.component.scss'],
})
export class SearchVersionsPaneComponent implements OnInit {
  @Input() version?: Version;
  @Output() exploreMilestone = new EventEmitter<Version>();

  protected isMilestone = false;
  protected isCreation = false;
  protected title: Observable<string>;
  protected subtitle: Observable<string>;
  protected description: string;

  constructor(
    private translate: TranslateService,
    public docService: DocumentService,
  ) {}

  ngOnInit(): void {
    this.updateState();
  }

  protected isIntermediate() {
    return this.version.versionType === 'INTERMEDIATE';
  }

  protected onSelectVersion(version: Version, inputChangeEvent: Event) {
    const checked = (inputChangeEvent.target as HTMLInputElement).checked;
    const currentVersions = this.docService.getVersionCompareIds();
    let newVersions: Version[];
    if (!checked) {
      newVersions = currentVersions.filter(
        (v) => v.documentId !== version.documentId,
      );
    } else if (currentVersions.length === 0) {
      newVersions = [version];
    } else {
      const sorted = this.sortVersions(...currentVersions);
      if (process.env.NG_APP_LEOS_INSTANCE === 'cn') {
        currentVersions.push(version);
        const sortedCN = this.sortVersions(...currentVersions);
        if (sortedCN.length === 3) {
          const minVersion = sortedCN[0];
          const medVersion = sortedCN[1];
          const maxVersion = sortedCN[2];
          newVersions = [minVersion, medVersion, maxVersion];
        } else {
          const minVersion = this.sortVersions(sorted.at(0), version)[0];
          const maxVersion = this.sortVersions(sorted.at(-1), version)[1];
          newVersions = [minVersion, maxVersion];
        }
      } else {
        const minVersion = this.sortVersions(sorted.at(0), version)[0];
        const maxVersion = this.sortVersions(sorted.at(-1), version)[1];
        newVersions = [minVersion, maxVersion];
      }
    }
    this.docService.setVersionCompareIds(newVersions);
  }

  protected isCompareCheckboxChecked(version: Version): boolean {
    const currentVersions = this.docService.getVersionCompareIds();
    return currentVersions.some((v) => v.documentId === version.documentId);
  }

  protected isCompareCheckboxDisabled(version: Version): boolean {
    const currentVersions = this.docService.getVersionCompareIds();
    if (process.env.NG_APP_LEOS_INSTANCE === 'cn') {
      return (
        currentVersions.length === 3 &&
        !currentVersions.some((v) => v.documentId === version.documentId)
      );
    } else {
      return (
        currentVersions.length === 2 &&
        !currentVersions.some((v) => v.documentId === version.documentId)
      );
    }
  }

  protected formatVersionNumber(version: Version): string {
    const { major, intermediate, minor } = version.versionNumber;
    return `${major}.${intermediate}.${minor}`;
  }

  protected formatTitle(version: Version): string {
    if (version.checkinCommentVO.checkinElement) {
      return (
        version.checkinCommentVO.checkinElement.elementLabel +
        ' ' +
        version.checkinCommentVO.checkinElement.actionType.toLowerCase()
      );
    } else {
      return version.checkinCommentVO.title;
    }
  }

  private updateState() {
    const { versionType, cmisVersionNumber, checkinCommentVO } = this.version;
    this.isMilestone = versionType === 'MAJOR';
    this.isCreation =
      versionType === 'INTERMEDIATE' && cmisVersionNumber === '1.0';
    this.description = checkinCommentVO.description;

    this.title = this.getTitle();
    this.subtitle = this.getSubtitle();
    const currentVersions = this.docService.getVersionCompareIds();
    if (currentVersions.length > 0) {
      const sortedCurrentVersions = this.sortVersions(...currentVersions);
      const maxSortedVersion = this.sortVersions(
        sortedCurrentVersions.at(-1),
        sortedCurrentVersions[0],
      )[1];
      const maxVersion = maxSortedVersion;
      const checkbox = document.getElementById(
        `select-${maxVersion.documentId}`,
      ) as HTMLInputElement;
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change'));
      this.onSelectVersion(maxVersion, {
        target: { checked: false },
      } as any);
      this.onSelectVersion(this.version, {
        target: { checked: true },
      } as any);
    }
  }

  private getTitle() {
    return this.translate.get('page.editor.versions.group-title', {
      version: this.formatVersionNumber(this.version),
      title: this.version.checkinCommentVO.title,
    });
  }

  private getSubtitle() {
    return of(`${this.version.updatedDate} ${this.version.createdBy}`);
  }

  private sortVersions(...versions: Version[]): Version[] {
    return orderBy(versions, [
      (v) => v.versionNumber.major,
      (v) => v.versionNumber.intermediate,
      (v) => v.versionNumber.minor,
    ]);
  }
}
