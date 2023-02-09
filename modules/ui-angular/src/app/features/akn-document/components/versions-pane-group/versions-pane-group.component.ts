import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { Version } from '@/features/akn-document/models/versions';

@Component({
  selector: 'app-versions-pane-group',
  templateUrl: './versions-pane-group.component.html',
  styleUrls: ['./versions-pane-group.component.scss'],
})
export class VersionsPaneGroupComponent implements OnInit {
  @Input() group: Version;

  isMilestone: boolean;
  isCreation: boolean;
  isRecents: boolean;
  title: string;
  subtitle: string;
  description: string;
  showModifications = false;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    const { versionType, cmisVersionNumber, checkinCommentVO } = this.group;
    this.isMilestone = versionType === 'MAJOR';
    this.isCreation =
      versionType === 'INTERMEDIATE' && cmisVersionNumber === '1.0';
    this.isRecents = !cmisVersionNumber;
    this.description = checkinCommentVO.description;
    this.setTitle();
    this.setSubtitle();
  }

  private setTitle() {
    if (this.isRecents) {
      this.translate
        .get('page.editor.versions.group-recents-title')
        .subscribe((title: string) => {
          this.title = title;
        });
    } else {
      this.translate
        .get('page.editor.versions.group-title', {
          version: this.group.cmisVersionNumber,
          title: this.group.checkinCommentVO.title,
        })
        .subscribe((title: string) => {
          this.title = title;
        });
    }
  }

  private setSubtitle() {
    const subtitle$ = this.isRecents
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
    if (this.group.subVersions.length) {
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
