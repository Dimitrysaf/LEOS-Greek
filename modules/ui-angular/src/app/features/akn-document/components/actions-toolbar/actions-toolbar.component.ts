import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';

import { TableOfContentService } from '../../services/table-of-content.service';

@Component({
  selector: 'app-actions-toolbar',
  templateUrl: './actions-toolbar.component.html',
  styleUrls: ['./actions-toolbar.component.scss'],
})
export class ActionsToolbarComponent implements AfterViewInit, OnDestroy {
  @Input() disabled = false;

  shouldReloadAfterUpdate = false;
  private destroy$ = new Subject<void>();

  constructor(
    public doc: DocumentService,
    private coEditionService: CoEditionServiceWS,
    private tableOfContentService: TableOfContentService,
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.coEditionService.shouldReloadAfterUpdate
      .pipe(takeUntil(this.destroy$))
      .subscribe((update) => {
        if (update === null) {
          this.shouldReloadAfterUpdate = false;
        } else if (this.coEditionService.presenterId !== update.presenterId) {
          this.shouldReloadAfterUpdate = true;
        }
      });
  }
  handleReload() {
    this.doc.reloadDocument();
    this.tableOfContentService.reload();
  }
}
