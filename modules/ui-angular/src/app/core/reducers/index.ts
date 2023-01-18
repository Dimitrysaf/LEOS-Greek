import { InjectionToken } from '@angular/core';
import {
  CoreState,
  getAppState,
  localStorageSync,
  reducers as coreReducers,
} from '@eui/core';
import { MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '../../../environments/environment';

export const REDUCER_TOKEN = new InjectionToken<any>('Registered Reducers');

/**
 * Define here your app state
 *
 * [IMPORTANT]
 * There are some **reserved** slice of the state
 * that you **can not** use in your application ==> app |user | notification
 */
// eslint-disable-next-line
export interface AppState extends CoreState {
  // [key: string]: fromTaskManager.State | any;
}

/**
 * Define here the reducers of your app
 */
const rootReducer = Object.assign({}, coreReducers, {
  // [fromTaskManager.namespace]: fromTaskManager.reducers,
});

export const getReducers = () => rootReducer;

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [localStorageSync, storeFreeze]
  : [localStorageSync];
