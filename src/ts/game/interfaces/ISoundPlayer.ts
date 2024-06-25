import {sounds} from "../types/types.ts";

export interface ISoundPlayer {
    element: HTMLElement;
    buffer: any;
    canPlay: any;
    withBuffer: boolean;

    configure(game: any): void

    loadSounds(sounds: sounds): void

    play(id: string): Promise<void>

    playAudio(id: string): Promise<void>

    addAudioContainer(): HTMLDivElement

    addAudioTag(src: string, id: string): void

    stopAll(): void;

    stop(id: string): void;
}