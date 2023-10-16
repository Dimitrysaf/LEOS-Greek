import { escapeRegExp } from 'lodash-es';
import { filter, map, Observable } from 'rxjs';

import {
  LocalStorageEvent,
  LocalStorageService,
} from './local-storage.service';

/**
 * A namespace specific local storage service. Can be used to create namespaced
 * entries, avoiding collisions with e.g. other apps or tabs.
 */
export class NamespacedLocalStorageService extends LocalStorageService {
  private get keyPrefix(): string {
    return `${this.getNamespace()}:`;
  }

  /**
   * Creates a new namespaced storage instance.
   *
   * @param namespace The namespace to use for all keys. Can be a string or a getter
   * function.
   */
  constructor(private readonly namespace: string | (() => string)) {
    super();
  }

  override get(key: string): any {
    return super.get(this.addKeyPrefix(key));
  }

  override set(key: string, value: any): void {
    return super.set(this.addKeyPrefix(key), value);
  }

  override remove(key: string): void {
    return super.remove(this.addKeyPrefix(key));
  }

  override clear(...keys: string[]): void {
    const eligibleKeys = keys.length ? keys : this.getKeys();
    if (eligibleKeys.length) {
      const prefixedKeys = eligibleKeys.map((key) => this.addKeyPrefix(key));
      return super.clear(...prefixedKeys);
    }
  }

  override getKeys(): string[] {
    return super
      .getKeys((key) => this.isPrefixedKey(key))
      .map((key) => this.removeKeyPrefix(key));
  }

  override observe(...keys: string[]): Observable<LocalStorageEvent> {
    keys = keys.map((key) => this.addKeyPrefix(key));
    const events$ = keys.length
      ? this.storageEvents$.pipe(filter((e) => keys.includes(e.key)))
      : this.storageEvents$.pipe(filter((e) => this.isPrefixedKey(e.key)));
    return events$.pipe(
      map((e) => ({
        ...this.mapToLocalStorageEvent(e),
        key: this.removeKeyPrefix(e.key),
      })),
    );
  }

  getNamespace(): string {
    return typeof this.namespace === 'function'
      ? this.namespace()
      : this.namespace;
  }

  private get prefixRx() {
    return new RegExp(`^${escapeRegExp(this.keyPrefix)}`);
  }

  private isPrefixedKey(key: string): boolean {
    return this.prefixRx.test(key);
  }

  private addKeyPrefix(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  private removeKeyPrefix(key: string): string {
    return key.replace(this.prefixRx, '');
  }
}
