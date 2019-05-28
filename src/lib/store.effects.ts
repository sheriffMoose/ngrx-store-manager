import { Injectable, Injector, Inject } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import { StoreManager, STORE_OPTIONS } from './store.manager';
import { StoreFacade } from './store.facade';

@Injectable()
export class StoreEffects {

  @Effect()
  dataAction$ = this.actions$
    .pipe(
      filter(action => action.type.endsWith('ACTION')),
      mergeMap((action: any) => {
        let returnObservable;
        if (action.service && action.method) {
          returnObservable = this.injector.get(action.service)[action.method](this.storeFacade, action.payload);
        } else {
          returnObservable = this.getPayloadObservable(action);
        }

        return returnObservable.pipe(
          map((payload) => this.storeManager.getAction(action.store, action._type, payload, 'SUCCESS')),
          catchError((error) => this.storeManager.getAction(action.store, action._type, error, 'ERROR') as any)
        );
      })
    );

  constructor(
    private actions$: Actions,
    private injector: Injector,
    private storeManager: StoreManager,
    private storeFacade: StoreFacade,
    @Inject(STORE_OPTIONS) private options
  ) { }

  getPayloadObservable(action) {
    if (this.options && this.options.useLocalStorage) {
      const item = localStorage.getItem(action.store);
      return of(item === 'undefined' ? {} : item || {});
    } else {
      return of(action.payload || {});
    }
  }
}