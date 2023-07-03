import { Component, Input, OnInit } from '@angular/core';

import { ContributionVO } from '@/shared/models/contribution-vo.model';

@Component({
  selector: 'app-revision-pane',
  templateUrl: './revision-pane.component.html',
  styleUrls: ['./revision-pane.component.scss'],
})
export class RevisionPaneComponent implements OnInit {
  @Input() contributions: ContributionVO[];
  constructor() {}

  ngOnInit(): void {}
}
