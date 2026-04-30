import { I as IAppState } from '../../iAppState-c16602ac.js';
import { I as IDataStore } from '../../iDataStore-7ba6eb0f.js';
export { a as IActionWithPayload } from '../../iDataStore-7ba6eb0f.js';
import '../../isncsciLevels-ce12763e.js';
import '../../totals-9c85749b.js';

declare class AppStore implements IDataStore<IAppState> {
    private handlers;
    private state;
    subscribe(handler: Function): () => void;
    getState(): IAppState;
    dispatch(action: any): void;
}
declare const appStore: AppStore;

declare class Actions {
    static CLEAR_TOTALS_AND_ERRORS: string;
    static SET_ACTIVE_CELL: string;
    static SET_CALCULATION_ERROR: string;
    static SET_CELLS_VALUE: string;
    static SET_EXTRA_INPUTS: string;
    static SET_GRID_MODEL: string;
    static SET_READONLY: string;
    static SET_TOTALS: string;
    static SET_VAC_DAP: string;
    static UPDATE_STATUS: string;
}

export { Actions, IDataStore, appStore };
