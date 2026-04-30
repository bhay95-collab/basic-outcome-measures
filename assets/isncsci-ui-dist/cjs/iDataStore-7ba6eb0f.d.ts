interface IActionWithPayload<T> {
    payload: T;
    type: string;
}
interface IDataStore<T> {
    subscribe(handler: Function): Function;
    getState(): T;
    dispatch(action: IActionWithPayload<any>): void;
}

export type { IDataStore as I, IActionWithPayload as a };
