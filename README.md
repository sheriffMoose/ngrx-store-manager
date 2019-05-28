# ngrx-store-manager

* An implementation of NgRx Facades on Angular 7.2.0.
* The purpose behind this library is to enable developers to create dynamic stores with dynamic actions and effects.
* All actions results will be saved in the store automatically on success.
* Allows saving store states into localStorage.

## Installation

Run `npm i ngrx-store-manager --save` to install the package.

## Configuration

Create a new `store.config.ts` file with 
```Typescript
import { StoreConfig } from 'ngrx-store-manager';
import { AppService } from './app.service';

export const AppConfig: StoreConfig[] = [
    {
        state: 'test',
        initialState: {
            approved: true
        },
        actions: [
            {
                name: 'GET_OTHER',
                service: AppService,
                method: 'getOtherData'
            },
            {
                name: 'SET_OTHER',
                service: AppService,
                method: 'setOtherData'
            }
        ]
    }
];
```

And in your `.module.ts` file add `StoreManagerModule` to the `imports` of your root module
```Typescript
StorageManagerModule.forRoot(AppConfig)
```
Or if you are using it in a feature module you can use `StorageManagerModule.forChild`
* In the snippet above, we are creating a new store by the name `test` and we added an initial state for that store
* We also added two actions, `GET` and `SET` which will use two methods from `AppService` to execute the actions

## LocalStorage Implementation

`forRoot` method can take `options` as second argument, the current acceptable options is `useLocalStorage` which can be set to `true` which will make the module always save store states into localStorage. Since this is obviously not recommended in production environment, it is best to use `!environment.production` from your Angular environment file.
```Typescript
StorageManagerModule.forRoot(AppConfig, { useLocalStorage: !environment.production })
```

## Facade

Using the facade will be easy from here on, just import the facade into your component file and add it to the constructor
```Typescript
import { StoreFacade } from 'ngrx-store-manager';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
    constructor(public store: StoreFacade) { }
}
```

## Facade API

#### select(storeName: string, sync?: boolean)
- use it to select data from the store by name.
- `this.store.select('test')` will get the store named `test` synchronously.
- `this.store.select('test', false)` will create an observable for the store named `test` which you can use with the `async` pipe.
#### dispatch(storeName: string, action: string, payload?: any)
- use this method to dispatch any event you need, payload is optional.
- will return an observable of that store, it will populate only when the action is done (as in an http request), then you can subscribe to that observable to work with the results.
#### getData(storeName: string, action?: string)
- an overload of the dispatch method with `GET` as default action and no payload.
- `this.store.getData('test', 'GET_OTHER')` will dispatch a `GET_OTHER` event.
#### setData(storeName: string, payload: any, action?: string)
- an overload of the dispatch method with `SET` as default action and payload is required.
- `this.store.getData('test', payload, 'SET_OTHER')` will dispatch a `SET_OTHER` event.

## Demo
Please refer to the demo folder or follow this link https://stackblitz.com/edit/ngrx-store-manager-demo


