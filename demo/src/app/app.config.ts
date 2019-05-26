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