import { Injectable, Injector } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import { StoreManager } from './store.manager';
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
          returnObservable = of(this.storeManager.getLocalItem(action.storeName, action.payload));
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
    private storeFacade: StoreFacade
  ) { }

}
