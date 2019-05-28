import { NgModule, ModuleWithProviders, Optional, Inject } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { StoreManager, STORE_CONFIG, STORE_OPTIONS } from './store.manager';
import { StoreFacade } from './store.facade';
import { StoreEffects } from './store.effects';
import { StoreConfig } from './store.model';

@NgModule({
  imports: [
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: true
    }),
    EffectsModule.forRoot([StoreEffects])
  ]
})
export class StoreManagerModule {

  static forRoot(config: StoreConfig[], options = { useLocalStorage: false }): ModuleWithProviders {
    return {
      ngModule: StoreManagerModule,
      providers: [StoreManager, StoreFacade,
        { provide: STORE_CONFIG, useValue: config, multi: true },
        { provide: STORE_OPTIONS, useValue: options }
      ]
    };
  }

  static forChild(config: StoreConfig[]): ModuleWithProviders {
    return {
      ngModule: StoreManagerModule,
      providers: [StoreFacade, { provide: STORE_CONFIG, useValue: config, multi: true }]
    };
  }

  constructor(storeManager: StoreManager, @Optional() @Inject(STORE_CONFIG) configs: StoreConfig[][] = []) {
    configs.forEach(c => {
      c.forEach(s => {
        storeManager.addState(s.state, s.initialState || {});
        s.actions.forEach(a => {
          storeManager.addAction(s.state, a.name, a.service, a.method);
        });
      });
    });
  }
}
