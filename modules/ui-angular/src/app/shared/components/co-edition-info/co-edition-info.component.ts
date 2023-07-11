import { formatDate } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { CoEditionVO } from '@/shared/models/coEditionVO.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';

@Component({
  selector: 'app-co-edition-info',
  templateUrl: './co-edition-info.component.html',
  styleUrls: ['./co-edition-info.component.scss'],
})
export class CoEditionInfoComponent implements OnInit, OnDestroy {
  @Input() documentCoEditions?: CoEditionVO[];
  @Input() isToc?: boolean;

  coEditiionForToc: CoEditionVO[];
  coEditionForDocumentId: Record<string, CoEditionVO[]>;

  private destroy$: Subject<any> = new Subject();
  constructor(private coEditionService: CoEditionServiceWS) {
    this.coEditionService.toCCoEditionInfo
      .pipe(takeUntil(this.destroy$))
      .subscribe((coEdits) => {
        this.coEditiionForToc = coEdits;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  ngOnInit(): void {}

  generateTooltip(coEdits: CoEditionVO[]) {
    if (!coEdits) return;
    let target = '';
    coEdits.forEach(
      (c) =>
        (target =
          target +
          `${c.userName} editing since ${formatDate(
            new Date(c.editionTime),
            'dd/MM/yyyy HH:mm',
            'en-US',
          )} \n `),
    );
    return target;
  }
}
