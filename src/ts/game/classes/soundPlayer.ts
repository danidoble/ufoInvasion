import {sounds} from "../types/types.ts";
import {ISoundPlayer} from "../interfaces/ISoundPlayer.ts";

export class SoundPlayer implements ISoundPlayer {
    public element: HTMLElement = document.body;

    public buffer: any = {};
    public canPlay: any = {};

    public withBuffer: boolean = false;

    configure(game: any): void {
        this.element = document.querySelector(game.element) || document.body;
        this.loadSounds(game.sounds);
    }

    loadSounds(sounds: sounds): void {
        for (const sound of Object.keys(sounds)) {
            // @ts-ignore
            this.addAudioTag(sounds[sound], sound);
            this.buffer[sound] = [];
            this.canPlay[sound] = true;
        }
    }

    async play(id: string): Promise<void> {
        this.buffer[id].push(true);
        await this.playAudio(id);
    }

    async playAudio(id: string): Promise<void> {
        if (!this.withBuffer) {
            this.canPlay[id] = true;
        }

        if (this.buffer[id].length > 0 && this.canPlay[id]) {
            this.canPlay[id] = false;
            const audio: HTMLElement | null = document.getElementById(`flappy_sound_${id}`);
            if (audio && audio instanceof HTMLAudioElement) {
                try {
                    if (!audio.paused) {
                        audio.pause();
                        audio.currentTime = 0;
                    }
                    await audio.play();
                    if (!this.withBuffer) {
                        this.buffer[id].shift();
                    }
                } catch (e) {
                    //...
                }
            }
        }
    }

    addAudioContainer(): HTMLDivElement {
        const audio: HTMLDivElement = document.createElement('div');
        audio.id = 'flappy_audios';
        audio.style.display = 'none';
        this.element.appendChild(audio);
        return audio;
    }

    addAudioTag(src: string, id: string): void {
        const audio: HTMLAudioElement = document.createElement('audio');
        audio.src = src;
        audio.id = `flappy_sound_${id}`;
        audio.preload = 'auto';
        audio.style.display = 'none';
        audio.addEventListener('ended', async () => {
            if (this.withBuffer) {
                this.buffer[id].shift();
                this.canPlay[id] = true;
                await this.playAudio(id);
            }
        });
        let container: HTMLElement | null = document.getElementById('flappy_audios');
        if (!container) {
            container = this.addAudioContainer();
        }
        container.appendChild(audio);
    }

    stopAll(): void {
        const container: HTMLElement | null = document.getElementById('flappy_audios');
        if (!container) return;

        const audios: NodeListOf<HTMLAudioElement> = container.querySelectorAll('audio');
        for (const audio of audios) {
            this.stop(audio.id.replace('flappy_sound_', '').toString());
        }
    }

    stop(id: string): void {
        const audio: HTMLElement | null = document.getElementById(`flappy_sound_${id}`);
        if (audio && audio instanceof HTMLAudioElement) {
            try {
                audio.pause();
                audio.currentTime = 0;
            } catch (e) {
                //...
            }
        }
    }
}
