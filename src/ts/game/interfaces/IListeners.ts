import {controls} from "../types/types.ts";

export interface IListeners {
    game: any
    config: controls

    configure(): Promise<void>

    addListenerKeyUp(): Promise<void>

    removeListenerKeyUp(): Promise<void>

    addListenerResize(): Promise<void>

    removeListenerResize(): Promise<void>

    addListenerTouchStart(element: HTMLElement): Promise<void>

    removeListenerTouchStart(element: HTMLElement): Promise<void>

    addListenerTouchToRestart(element: HTMLElement): Promise<void>

    removeListenerTouchToRestart(element: HTMLElement): Promise<void>

    addListenerClickTap(element: HTMLElement): Promise<void>

    removeListenerClickTap(element: HTMLElement): Promise<void>

    addCheckFocusOnWindow(): Promise<void>

    removeCheckFocusOnWindow(): Promise<void>

    handleKeyboardEvents(event: KeyboardEvent): Promise<void>

    listenerKeyUp(event: KeyboardEvent): Promise<void>

    listenerWindowBlur(): Promise<void>

    listenerWindowFocus(): Promise<void>

    listenerResize(): Promise<void>

    listenerTouchStart(): Promise<void>

    listenerTouchToRestart(event: any): Promise<void>
}