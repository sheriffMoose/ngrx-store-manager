import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { StoreManager } from './store.manager';

@Injectable()
export class StoreFacade {

  constructor(private store: Store<any>, private storeManager: StoreManager) { }

  select(storeName: string, sync = true) {
    let state;
    const observable = this.store.pipe(select(storeName));
    if (sync) {
      observable.pipe(take(1)).subscribe(s => state = s);
      return state;
    } else {
      return observable;
    }
  }

  dispatch(storeName: string, action: string, payload?) {
    this.store.dispatch(this.storeManager.getAction(storeName, action, payload));
    return this.store.pipe(select(storeName)).pipe(filter(payload => !!payload && !!payload.isSuccessful), take(1));
  }

  getData(storeName: string, action = 'GET') {
    return this.dispatch(storeName, action);
  }

  setData(storeName: string, payload, action = 'SET') {
    return this.dispatch(storeName, action, payload);

  }
}