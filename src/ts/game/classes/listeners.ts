import {wait} from "./utils.ts";
import {controls} from "../types/types.ts";
import {IListeners} from "../interfaces/IListeners.ts";

export class Listeners implements IListeners {

    public game: any;

    public config: controls = {
        pause: ['Escape', 'KeyP'],
        restart: ['Enter'],
        tap: ['Space']
    }

    constructor(game: any) {
        this.game = game;
    }

    async configure(): Promise<void> {
        await this.addListenerResize();
        await this.addCheckFocusOnWindow();
        await this.addListenerKeyUp();
    }

    async addListenerKeyUp(): Promise<void> {
        document.addEventListener('keyup', this.listenerKeyUp.bind(this));
    }

    async removeListenerKeyUp(): Promise<void> {
        document.removeEventListener('keyup', this.listenerKeyUp.bind(this));
    }

    async addCheckFocusOnWindow(): Promise<void> {
        window.addEventListener('blur', this.listenerWindowBlur.bind(this));
        window.addEventListener('focus', this.listenerWindowFocus.bind(this));
    }

    async removeCheckFocusOnWindow(): Promise<void> {
        window.removeEventListener('blur', this.listenerWindowBlur.bind(this));
        window.removeEventListener('focus', this.listenerWindowFocus.bind(this));
    }

    async addListenerResize(): Promise<void> {
        window.addEventListener('resize', this.listenerResize.bind(this));
    }

    async removeListenerResize(): Promise<void> {
        window.removeEventListener('resize', this.listenerResize.bind(this));
    }

    async addListenerTouchStart(element: HTMLElement): Promise<void> {
        element.addEventListener('click', this.listenerTouchStart.bind(this));
    }

    async removeListenerTouchStart(element: HTMLElement): Promise<void> {
        element.removeEventListener('click', this.listenerTouchStart.bind(this));
    }

    async addListenerTouchToRestart(element: HTMLElement): Promise<void> {
        element.addEventListener('contextmenu', this.listenerTouchToRestart.bind(this));
    }

    async removeListenerTouchToRestart(element: HTMLElement): Promise<void> {
        element.removeEventListener('contextmenu', this.listenerTouchToRestart.bind(this));
    }

    async addListenerClickTap(element: HTMLElement): Promise<void> {
        element.addEventListener('click', this.listenerTouchStart.bind(this));
    }

    async removeListenerClickTap(element: HTMLElement): Promise<void> {
        element.removeEventListener('click', this.listenerTouchStart.bind(this));
    }

    async handleKeyboardEvents(event: KeyboardEvent): Promise<void> {
        if (!this.game.isFocused()) return;

        if (!this.game.isPlaying()) {
            if (this.config.restart.includes(event.code)) {
                this.game.restart();
            }

            if (this.config.tap.includes(event.code) && this.game.screens.isTapToStartScreen()) {
                this.game.start();
            }
            return;
        }

        if (this.config.tap.includes(event.code)) {
            this.game.birdTap();
        }

        if (this.config.pause.includes(event.code)) {
            this.game.pause();
        }
    }

    /*!
     * This next methods area function separated to remove the event listener if needed.
     */

    async listenerKeyUp(event: KeyboardEvent): Promise<void> {
        await this.handleKeyboardEvents(event);
    }

    async listenerWindowBlur(): Promise<void> {
        if (this.game.isFocused() && this.game.isPlaying()) {
            this.game.paused = false;
            this.game.pause();
        }
    }

    async listenerWindowFocus(): Promise<void> {
        if (this.game.isFocused() && this.game.isPlaying()) {
            await wait(500);
            this.game.paused = true;
            this.game.pause();
        }
    }

    async listenerResize(): Promise<void> {
        this.game.onWindowResize();
    }

    async listenerTouchStart(): Promise<void> {
        if (!this.game.isFocused()) return;
        if (!this.game.isPlaying() && this.game.screens.isTapToStartScreen()) {
            await this.game.start();
            return;
        }
        this.game.birdTap();
    }

    async listenerTouchToRestart(event: any): Promise<void> {
        event.preventDefault();
        if (!this.game.isFocused()) return;
        if (!this.game.isPlaying() && this.game.screens.isTapToRestartScreen()) {
            await this.game.restart();
        }
    }
}
