import {
  BehaviorSubject,
  mergeMap,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

import { LeosLegacyService } from '@/features/leos-legacy/services/leos-legacy.service';

import { ElementName, ImportExtension } from '../../models/import.model';
import { ImportConnector } from './import-connector';

export class ImportManager {
  count$: Observable<number>;

  private connector = this.createConnector();
  private destroy$ = new Subject<void>();
  private selectedElementsCb = new Set<(elementIds: string[]) => void>();
  private countSubj = new BehaviorSubject(0);

  constructor(private leos: LeosLegacyService, private parentElement: Element) {
    this.count$ = this.countSubj.asObservable();
    this.getImportExtension().subscribe((importExtension) => {
      importExtension.init(this.connector);
      this.connector.jsDepsInited();
    });
  }

  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.connector?.destroy();
    this.countSubj.next(0);
  }

  async getSelectedElements(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (this.connector) {
        this.selectedElementsCb.add(resolve);
        this.connector.requestSelectedElements();
      } else {
        reject(new Error('Connector not initialized yet'));
      }
    });
  }

  selectAllElements(value: boolean, elementName: ElementName) {
    this.connector.selectAllElements(value, elementName);
  }

  private createConnector() {
    const handleSelectionChange = (count: number) => {
      this.countSubj.next(count);
    };
    const receiveSelectedElements = (elementIds: string[]) => {
      this.selectedElementsCb.forEach((cb) => cb(elementIds));
      this.selectedElementsCb.clear();
    };
    return new ImportConnector({
      parentElement: this.parentElement,
      handleSelectionChange,
      receiveSelectedElements,
    });
  }

  private getImportExtension() {
    return this.leos.require$.pipe(
      takeUntil(this.destroy$),
      mergeMap(
        (require) =>
          new Observable<ImportExtension>((subscriber) => {
            require(['extension/importElementExtension'], (importExt) => {
              subscriber.next(importExt);
            });
          }),
      ),
    );
  }
}
