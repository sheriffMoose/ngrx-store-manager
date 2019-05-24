import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';
import { StoreManager } from './store.manager';

@Injectable()
export class StoreFacade {

  constructor(private store: Store<any>, private storeManager: StoreManager) { }

  select(storeName, sync = true) {
    let state;
    const observable = this.store.pipe(select(storeName));
    if (sync) {
      observable.pipe(take(1)).subscribe(s => state = s);
      return state;
    } else {
      return observable;
    }
  }

  getData(store, action = 'GET') {
    this.store.dispatch(this.storeManager.getAction(store, action));
    return this.store.pipe(select(store)).pipe(filter(payload => !!payload && !!payload.isSuccessful), take(1));
  }

  setData(store, payload, action = 'SET') {
    this.store.dispatch(this.storeManager.getAction(store, action, payload));
    return this.store.pipe(select(store)).pipe(filter(payload => !!payload && !!payload.isSuccessful), take(1));
  }
}