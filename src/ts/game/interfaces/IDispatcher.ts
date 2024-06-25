export interface IDispatcher {
    dispatch(type: string, data: any): void;

    on(type: string, callback: EventListenerOrEventListenerObject): void;
}

export interface IGameEvent {
    // ...
}