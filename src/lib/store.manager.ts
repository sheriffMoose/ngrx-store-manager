import { Injectable, InjectionToken } from '@angular/core';
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
      let newState = state;
      if (action.store === storeName) {
        if (action.type.endsWith('DATA_SUCCESS')) {
          newState = {
            ...state,
            ...action.payload,
            isSuccessful: true
          }
        } else {
          if (this.options && this.options.useLocalStorage && !initialState) {
            newState = localStorage.getItem(storeName);
          } else {
            newState = {
              ...state,
              isSuccessful: false
            }
          }
        }
      }
      if (this.options && this.options.useLocalStorage) {
        localStorage.setItem(storeName, newState);
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
      store: store,
      _type: type,
      type: `[${store}] ${type}_DATA_${status}`,
      service: ((this.actions[store] || {})[type] || {}).service,
      method: ((this.actions[store] || {})[type] || {}).method,
      payload: payload
    }
  }
}