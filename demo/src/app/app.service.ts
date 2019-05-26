import { Injectable } from '@angular/core';
import { StoreFacade, StoreManager } from 'ngrx-store-manager';
import { of } from 'rxjs';

@Injectable()
export class AppService {
    getOtherData(store: StoreFacade) {
        return of({ name: 'Ruvalter' });
    }

    setOtherData(store: StoreFacade, payload) {
        return of({ ...payload, age: 32 });
    }
}