import {IDispatcher, IGameEvent} from "./../interfaces/IDispatcher";

export class Dispatcher extends EventTarget implements IDispatcher {
    dispatch(type: string, data: any = null): void {
        const event: CustomEvent = new GameEvent(type, {detail: data})
        this.dispatchEvent(event);
    }

    on(type: string, callback: EventListenerOrEventListenerObject): void {
        this.addEventListener(type, callback);
    }
}

export class GameEvent extends CustomEvent<IGameEvent> {
    constructor(type: string, detail: IGameEvent | undefined) {
        super(type, detail);
    }
}


// birdOut
// gameOver
// started
// bonusPicked