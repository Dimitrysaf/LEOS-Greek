import { Injectable, OnDestroy } from '@angular/core';
import { pick } from 'lodash-es';
import {
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

export type LocalStorageEvent = Pick<
  StorageEvent,
  'key' | 'newValue' | 'oldValue' | 'url'
>;

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService implements OnDestroy {
  protected destroy$ = new Subject<void>();
  protected storageEvents$: Observable<StorageEvent>;
  private ownEventsS = new Subject<StorageEvent>();

  constructor() {
    const extEvents$ = fromEvent<StorageEvent>(window, 'storage').pipe(
      filter((e) => e.storageArea === localStorage),
    );
    const ownEvents$ = this.ownEventsS.asObservable();
    this.storageEvents$ = merge(extEvents$, ownEvents$).pipe(
      takeUntil(this.destroy$),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Retrieve an object from local storage.
   *
   * @param key the associated key
   * @returns the value or undefined, if case of error
   */
  get(key: string): any {
    try {
      const serialized = localStorage.getItem(key);
      return serialized && JSON.parse(serialized);
    } catch (err) {
      return undefined;
    }
  }

  /**
   * Sets an object in local storage.
   *
   * @param key the associated key
   * @param value the value to set
   */
  set(key: string, value: any): void {
    try {
      const oldValue = window.localStorage.getItem(key);
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      this.publishLocalChanges(key, serialized, oldValue);
    } catch (err) {}
  }

  /**
   * Removes an object from local storage.
   *
   * @param key the associated key
   */
  remove(key: string): void {
    try {
      const oldValue = window.localStorage.getItem(key);
      localStorage.removeItem(key);
      this.publishLocalChanges(key, null, oldValue);
    } catch (err) {}
  }

  /**
   * Clears all objects from local storage.
   *
   * WARNING: unless you specify the keys, this will clear all objects from
   * local storage, from all sites of the same origin!
   */
  clear(...keys: string[]): void {
    if (keys.length) {
      keys.forEach((key) => this.remove(key));
      return;
    }
    try {
      localStorage.clear();
    } catch (err) {}
  }

  /**
   * Returns all keys from local storage.
   *
   * @param filterFn an optional filter function to apply to the keys
   */
  getKeys(filterFn = (x: string) => true): string[] {
    return Object.keys(localStorage).filter(filterFn);
  }

  /**
   * Returns an observable of storage events. If no keys are specified, all
   * events are returned.
   */
  observe(...keys: string[]): Observable<LocalStorageEvent> {
    const events$ = keys.length
      ? this.storageEvents$.pipe(filter((e) => keys.includes(e.key)))
      : this.storageEvents$;
    return events$.pipe(map(this.mapToLocalStorageEvent.bind(this)));
  }

  protected mapToLocalStorageEvent(e: StorageEvent): LocalStorageEvent {
    return pick(e, 'key', 'newValue', 'oldValue', 'url');
  }

  private publishLocalChanges(
    key: string,
    newValue: string | null,
    oldValue: string | null,
  ) {
    const event = new StorageEvent('storage', {
      key,
      newValue,
      oldValue,
      url: window.location.href,
      storageArea: window.localStorage,
    });
    this.ownEventsS.next(event);
  }
}
