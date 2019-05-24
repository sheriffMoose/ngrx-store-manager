import { NgModule } from '@angular/core';

import { StoreModule, INITIAL_REDUCERS } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { StoreManager } from './store.manager';
import { StoreFacade } from './store.facade';
import { StoreEffects } from './store.effects';

@NgModule({
  imports: [
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: true, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([StoreEffects])
  ],
  providers: [StoreFacade, StoreManager],
})
export class StoreManagerModule { }