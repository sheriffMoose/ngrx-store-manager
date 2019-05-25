import { Injectable } from '@angular/core';
import { ReducerManager } from '@ngrx/store';

@Injectable()
export class StoreManager {
  reducers = [];
  actions = {};

  constructor(private reducerManager: ReducerManager) { }

  addState(storeName, initialState?) {
    this.reducers.push(storeName);
    this.reducerManager.addReducer(storeName, (state = initialState, action) => {
      if (action.store === storeName) {
        if (action.type.endsWith('DATA_SUCCESS')) {
          return {
            ...state,
            ...action.payload,
            isSuccessful: true
          }
        } else {
          return {
            ...state,
            isSuccessful: false
          }
        }
      }
      return state;
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