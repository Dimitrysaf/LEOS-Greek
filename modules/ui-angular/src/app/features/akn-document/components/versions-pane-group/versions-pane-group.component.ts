import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { Version } from '@/features/akn-document/models/versions';
import { DocumentService } from '@/shared/services/document.service';

@Component({
  selector: 'app-versions-pane-group',
  templateUrl: './versions-pane-group.component.html',
  styleUrls: ['./versions-pane-group.component.scss'],
})
export class VersionsPaneGroupComponent implements OnInit {
  @Input() group: Version;
  @Input() recentChanges: Version[];
  @Input() isRecent: boolean;

  isMilestone: boolean;
  isCreation: boolean;
  title: string;
  subtitle: string;
  description: string;
  showModifications = false;

  constructor(
    private translate: TranslateService,
    public docService: DocumentService,
  ) {}

  ngOnInit(): void {
    if (this.group) {
      const { versionType, cmisVersionNumber, checkinCommentVO } = this.group;
      this.isMilestone = versionType === 'MAJOR';
      this.isCreation =
        versionType === 'INTERMEDIATE' && cmisVersionNumber === '1.0';
      this.description = checkinCommentVO.description;
    }

    this.setTitle();
    this.setSubtitle();
  }

  onSelectVersion(event) {
    if (event.target.checked) {
      const idParts = event.target.id.split('-');
      const currentIdsArray = this.docService.getVersionsIdsArray();
      if (!currentIdsArray || currentIdsArray.newVersion !== null) {
        this.docService.setVersionIdsForCompare({
          oldVersion: idParts[1],
          newVersion: null,
        });
      } else if (currentIdsArray && currentIdsArray.oldVersion !== null) {
        const oldV =
          currentIdsArray.oldVersion < idParts[1]
            ? currentIdsArray.oldVersion
            : idParts[1];
        const newV =
          currentIdsArray.oldVersion < idParts[1]
            ? idParts[1]
            : currentIdsArray.oldVersion;

        this.docService.setVersionIdsForCompare({
          oldVersion: oldV,
          newVersion: newV,
        });
      }
    }
  }

  protected formatVersionNumber(version: Version): string {
    const { major, intermediate, minor } = version.versionNumber;
    return `${major}.${intermediate}.${minor}`;
  }

  private setTitle() {
    if (this.isRecent) {
      this.translate
        .get('page.editor.versions.group-recents-title')
        .subscribe((title: string) => {
          this.title = title;
        });
    } else {
      this.translate
        .get('page.editor.versions.group-title', {
          version: this.formatVersionNumber(this.group),
          title: this.group.checkinCommentVO.title,
        })
        .subscribe((title: string) => {
          this.title = title;
        });
    }
  }

  private setSubtitle() {
    const subtitle$ = this.isRecent
      ? this.getRecentsSubtitle()
      : this.getGroupSubtitle();
    subtitle$.subscribe((subtitle: string) => {
      this.subtitle = subtitle;
    });
  }

  private getGroupSubtitle() {
    const [dateString, timeSting] = this.group.updatedDate
      .toString()
      .split(' ');
    const [day, month, year] = dateString.split('/');
    const [hours, minutes] = timeSting.split(':');
    const dateToBeFormatted = new Date(
      +year,
      +month - 1,
      +day,
      +hours,
      +minutes,
    );
    const date = formatDate(dateToBeFormatted, 'dd/mm/yyyy HH:MM', 'en-US');
    const user = this.group.username;

    return of(`${date} ${user}`);
  }

  private getRecentsSubtitle() {
    if (this.group?.subVersions.length) {
      const [dateString, timeSting] = this.group.subVersions[0].updatedDate
        .toString()
        .split(' ');
      const [day, month, year] = dateString.split('/');
      const [hours, minutes] = timeSting.split(':');
      const dateToBeFormatted = new Date(
        +year,
        +month - 1,
        +day,
        +hours,
        +minutes,
      );
      const date = formatDate(dateToBeFormatted, 'dd/mm/yyyy HH:MM', 'en-US');
      return this.translate.get('page.editor.versions.group-recents-subtitle', {
        date,
      });
    } else {
      return this.translate.get(
        'page.editor.versions.group-recents-subtitle-empty',
      );
    }
  }
}
