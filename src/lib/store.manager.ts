import { Injectable, InjectionToken, Inject } from '@angular/core';
import { ReducerManager } from '@ngrx/store';
import { StoreConfig } from './store.model';

export const STORE_CONFIG = new InjectionToken<StoreConfig[]>('STORE_CONFIG');
export const STORE_OPTIONS = new InjectionToken<StoreConfig[]>('STORE_OPTIONS');

@Injectable()
export class StoreManager {
  reducers = [];
  actions = {};

  constructor(private reducerManager: ReducerManager, @Inject(STORE_OPTIONS) private options) { }

  addState(storeName, initialState?) {
    this.reducers.push(storeName);
    this.reducerManager.addReducer(storeName, (state = initialState, action) => {
      let newState = this.getLocalItem(storeName, initialState);
      if (action.store === storeName) {
        if (action.type.endsWith('DATA_SUCCESS')) {
          newState = {
            ...state,
            ...action.payload,
            isSuccessful: true
          };
        } else {
          newState = {
            ...state,
            isSuccessful: false
          };
        }
      }
      if (this.options && this.options.useLocalStorage) {
        localStorage.setItem(storeName, JSON.stringify(newState));
      }
      return newState;
    });
  }

  addAction(storeName, actionType, service, method) {
    if (this.reducers.indexOf(storeName) === -1) {
      this.addState(storeName);
    }
    this.actions[storeName] = this.actions[storeName] || {};
    this.actions[storeName][actionType] = this.actions[storeName][actionType] || {};
    this.actions[storeName][actionType].service = service;
    this.actions[storeName][actionType].method = method;
  }

  getAction(store, type, payload?, status = 'ACTION') {
    return {
      store,
      _type: type,
      type: `[${store}] ${type}_DATA_${status}`,
      service: ((this.actions[store] || {})[type] || {}).service,
      method: ((this.actions[store] || {})[type] || {}).method,
      payload
    };
  }

  getLocalItem(storeName, payload) {
    if (this.options.useLocalStorage) {
      const item = localStorage.getItem(storeName);
      return item === 'undefined' ? {} : JSON.parse(item) || payload || {};
    } else {
      return payload || {};
    }
  }
}
