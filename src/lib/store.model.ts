export interface StoreConfig {
    state: string;
    initialState?: {
        [property: string]: any;
    };
    actions?: {
        name: string;
        service: any;
        method: string;
    }[];
};