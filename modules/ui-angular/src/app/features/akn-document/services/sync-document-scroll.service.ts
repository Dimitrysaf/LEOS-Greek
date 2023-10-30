import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SyncDocumentScrollService {
  public isSyncScrollEnabled$: Observable<boolean>;
  private scrollables = new Map<HTMLElement, () => void>();

  private isSyncScrollEnabledBS = new BehaviorSubject<boolean>(true);

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.isSyncScrollEnabled$ = this.isSyncScrollEnabledBS.asObservable();
    this.isSyncScrollEnabled$.subscribe((value) => {
      this.toggleSyncScroll(value);
    });
  }

  private toggleSyncScroll(isEnabled: boolean) {
    if (isEnabled) {
      this.document
        .querySelectorAll('.sync-scroll')
        .forEach((scrollable: HTMLElement) => {
          const handler = this.handleSyncScroll.bind(this);
          scrollable.addEventListener('scroll', handler);
          scrollable.classList.add('sync-scroll-enabled');
          scrollable.classList.remove('sync-scroll-disabled');

          const destroyFn = () => {
            scrollable.removeEventListener('scroll', handler);
            scrollable.classList.add('sync-scroll-disabled');
            scrollable.classList.remove('sync-scroll-enabled');
            this.scrollables.delete(scrollable);
          };
          this.scrollables.set(scrollable, destroyFn);
        });
    } else {
      [...this.scrollables.values()].forEach((destroyFn) => destroyFn());
    }
  }

  public setSyncScroll(value) {
    this.isSyncScrollEnabledBS.next(value);
  }

  public syncScrollByNavigationChange(sender: HTMLElement) {
    const scrolledDiv = sender.closest('.sync-scroll');

    [...this.scrollables.keys()]
      .filter((scrollable) => scrollable.id !== scrolledDiv.id)
      .forEach((scrollable) => {
        requestAnimationFrame(() => {
          scrollable.scrollTop = scrolledDiv.scrollTop;
        });
      });
  }

  get isSyncScrollEnabled() {
    return this.isSyncScrollEnabledBS.value;
  }

  private handleSyncScroll(event: Event) {
    if (!this.isSyncScrollEnabled) {
      return;
    }
    const sender = event.target as HTMLElement;
    if (sender.matches(':hover')) {
      requestAnimationFrame(() => {
        const percentage =
          sender.scrollTop / (sender.scrollHeight - sender.clientHeight);
        [...this.scrollables.keys()]
          .filter((scrollable) => scrollable !== sender)
          .forEach((scrollable) => {
            scrollable.scrollTop =
              percentage * (scrollable.scrollHeight - scrollable.clientHeight);
          });
      });
    }
  }
}
