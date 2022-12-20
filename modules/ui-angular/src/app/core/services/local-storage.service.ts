import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

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
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (err) {}
  }

  /**
   * Removes an object from local storage.
   *
   * @param key the associated key
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (err) {}
  }
}
