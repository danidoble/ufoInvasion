import {__} from './utils/locale.ts';
import {Errors} from "./errors.ts";
import {IScreens} from "../interfaces/IScreens.ts";

export class Screens extends Errors implements IScreens {
    public game: any;
    public elementSelector: string = 'body';
    public element: HTMLElement = document.body;

    configure(game: any): void {
        this.game = game;
        this.elementSelector = this.game.element;
        this.element = document.querySelector(this.elementSelector) || document.body;
        this.initStats();
    }

    loading(): void {
        if (document.getElementById('loading-flappy') || !this.element) return;

        const el: HTMLElement = document.createElement('div');
        el.id = 'loading-flappy';
        el.classList.add('fixed', 'inset-0', 'flex', 'justify-center', 'items-center', 'bg-black', 'bg-opacity-80', 'z-50');
        el.innerHTML = `
        <div class="max-w-xs flex-1 bg-gray-900 bg-opacity-60 p-4 rounded-xl">
            <div class="flex justify-center mb-4 p-4"><svg class="size-12 sm:size-16 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg></div>
            <p class="text-white text-2xl text-center">${__('loading')}</p>
        </div>
    `;
        this.element.appendChild(el);
    }

    removeLoading(): void {
        const el: HTMLElement | null = document.getElementById('loading-flappy');
        if (el) {
            el.remove();
        }
    }

    tapToStartScreen(): void {
        if (!this.element) return;
        const el: HTMLElement | null = document.getElementById('tap-to-start')
        if (el) {
            el.classList.remove('hidden');
            return;
        }

        const tapToStart: HTMLDivElement = document.createElement('div');
        tapToStart.id = 'tap-to-start';
        tapToStart.classList.add('fixed', 'inset-0', 'flex', 'justify-center', 'items-center', 'bg-black', 'bg-opacity-30', 'z-50')

        tapToStart.innerHTML = `<div class="bg-white ring-2 ring-offset-4 ring-white ring-offset-gray-900 rounded-xl px-4 py-12 text-center text-2xl text-black w-full max-w-lg animate-wiggle animate-infinite animate-duration-[2000ms] animate-delay-0 animate-ease-in-out animate-alternate-reverse animate-fill-both">
            <div class="inline-flex items-center gap-4">
                <div class="size-10 animate-jump animate-infinite animate-duration-1000 animate-delay-0 animate-ease-linear animate-alternate-reverse animate-fill-both"><svg class="fill-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 96c17.7 0 32 14.3 32 32s-14.3 32-32 32l-208 0 0-64 208 0zM320 288c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0zm64-64c0 17.7-14.3 32-32 32l-48 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l48 0c17.7 0 32 14.3 32 32zM288 384c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0zm-88-96l.6 0c-5.4 9.4-8.6 20.3-8.6 32c0 13.2 4 25.4 10.8 35.6C177.9 364.3 160 388.1 160 416c0 11.7 3.1 22.6 8.6 32l-8.6 0C71.6 448 0 376.4 0 288l0-61.7c0-42.4 16.9-83.1 46.9-113.1l11.6-11.6C82.5 77.5 115.1 64 149 64l27 0c35.3 0 64 28.7 64 64l0 88c0 22.1-17.9 40-40 40s-40-17.9-40-40l0-56c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 56c0 39.8 32.2 72 72 72z"/></svg></div>
                <p>${__('screens.tap_to_start')}</p>
                <div class="size-10 animate-jump animate-infinite animate-duration-1000 animate-delay-0 animate-ease-linear animate-alternate-reverse animate-fill-both"><svg class="fill-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M32 96C14.3 96 0 110.3 0 128s14.3 32 32 32l208 0 0-64L32 96zM192 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0zm-64-64c0 17.7 14.3 32 32 32l48 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-48 0c-17.7 0-32 14.3-32 32zm96 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0zm88-96l-.6 0c5.4 9.4 8.6 20.3 8.6 32c0 13.2-4 25.4-10.8 35.6c24.9 8.7 42.8 32.5 42.8 60.4c0 11.7-3.1 22.6-8.6 32l8.6 0c88.4 0 160-71.6 160-160l0-61.7c0-42.4-16.9-83.1-46.9-113.1l-11.6-11.6C429.5 77.5 396.9 64 363 64l-27 0c-35.3 0-64 28.7-64 64l0 88c0 22.1 17.9 40 40 40s40-17.9 40-40l0-56c0-8.8 7.2-16 16-16s16 7.2 16 16l0 56c0 39.8-32.2 72-72 72z"/></svg></div>
            </div>
            <div class="w-full my-1">
                <img alt="Image Tap" src="${this.game.assets.tap}" class="size-24 mx-auto animate-jump animate-infinite animate-duration-1000 animate-delay-0 animate-ease-linear animate-alternate-reverse animate-fill-both"/>
            </div>
        </div>`;
        this.game.listeners.addListenerTouchStart(tapToStart).then((): void => {
        });
        this.element.appendChild(tapToStart);
    }

    isTapToStartScreen(): boolean {
        const el: HTMLElement | null = document.getElementById('tap-to-start');
        if (!el) {
            return false;
        }
        return !el.classList.contains('hidden');
    }

    isTapToRestartScreen(): boolean {
        const restart: HTMLElement | null = document.getElementById('restart');
        const end: HTMLElement | null = document.getElementById('end-screen');
        if (!restart && !end) {
            return false;
        }
        if (restart && end) {
            return !restart.classList.contains('hidden') || !end.classList.contains('hidden')
        }

        if (restart) {
            return !restart.classList.contains('hidden');
        }
        if (end) {
            return !end.classList.contains('hidden');
        }
        return false;
    }

    hideTapToStartScreen(): void {
        const tapToStart: HTMLElement | null = document.getElementById('tap-to-start');
        if (tapToStart) {
            tapToStart.classList.add('hidden');
        }
    }

    pausedScreen(): void {
        if (!this.element) return;
        const el: HTMLElement | null = document.getElementById('flappy-paused')
        if (el) {
            el.classList.remove('hidden');
            return;
        }

        const tapToStart: HTMLDivElement = document.createElement('div');
        tapToStart.id = 'flappy-paused';
        tapToStart.classList.add('fixed', 'inset-0', 'flex', 'justify-center', 'items-center', 'bg-black', 'bg-opacity-80', 'z-50', 'text-white', 'text-2xl')
        tapToStart.innerHTML = 'Paused';
        this.element.appendChild(tapToStart);
    }

    hidePausedScreen(): void {
        const el: HTMLElement | null = document.getElementById('flappy-paused');
        if (el) {
            el.classList.add('hidden');
        }
    }

    restartScreen(): void {
        if (!this.element) return;
        const el: HTMLElement | null = document.getElementById('restart')
        if (el) {
            el.classList.remove('hidden');
            return;
        }

        const restart: HTMLDivElement = document.createElement('div');
        restart.id = 'restart';
        restart.classList.add('fixed', 'inset-0', 'flex', 'justify-center', 'items-center', 'bg-black', 'bg-opacity-80', 'z-50', 'text-white', 'text-2xl')
        restart.innerHTML = 'Restart';
        this.game.listeners.addListenerTouchToRestart(restart).then((): void => {
        });
        this.element.appendChild(restart);
    }

    hideRestartScreen(): void {
        const restart: HTMLElement | null = document.getElementById('restart');
        if (restart) {
            restart.classList.add('hidden');
        }
    }

    paused(paused: boolean): void {
        if (paused) {
            this.pausedScreen();
        } else {
            this.hidePausedScreen();
        }
    }

    addStatsContainer(): HTMLDivElement {
        if (!this.element) {
            this.element = document.body;
        }
        const stats: HTMLDivElement = document.createElement('div');
        stats.id = 'flappy_stats';
        stats.classList.add('fixed', 'top-0', 'right-0', 'left-0', 'grid', 'grid-cols-3', 'items-center', 'bg-transparent', 'z-50', 'text-white', 'text-2xl');
        this.element.appendChild(stats);
        return stats;
    }

    initStats(): void {
        this.addStatsContainer();
        this.highScoreCorner(0);
        this.timeCenter('00:00');
        this.scoreCorner(0)
    }

    highScoreCorner(score: string | number): void {
        let container: HTMLElement | null = document.getElementById('flappy_stats');
        if (!container) {
            container = this.addStatsContainer();
        }

        const el: HTMLElement | null = document.getElementById('high_score');
        if (el) {
            el.innerHTML = `${__('screens.high_score')}: ${score}`;
            return;
        }

        const highScoreCorner: HTMLDivElement = document.createElement('div');
        highScoreCorner.classList.add('flex', 'justify-start');
        highScoreCorner.innerHTML = `<div class="m-4 p-4 text-white text-lg rounded-xl bg-black bg-opacity-80" id="high_score">${__('screens.high_score')}: ${score}</div>`;
        container.appendChild(highScoreCorner);
    }

    scoreCorner(score: string | number): void {
        let container: HTMLElement | null = document.getElementById('flappy_stats');
        if (!container) {
            container = this.addStatsContainer();
        }

        const el: HTMLElement | null = document.getElementById('score-corner');
        if (el) {
            el.innerHTML = `${__('score')}: ${score}`;
            return;
        }

        const scoreCorner: HTMLDivElement = document.createElement('div');
        scoreCorner.classList.add('flex', 'justify-end');
        scoreCorner.innerHTML = `<div class="m-4 p-4 text-white text-xl rounded-xl bg-black bg-opacity-80" id="score-corner">${__('score')}: ${score}</div>`;
        container.appendChild(scoreCorner);
    }

    timeCenter(time: string | number): void {
        let container: HTMLElement | null = document.getElementById('flappy_stats');
        if (!container) {
            container = this.addStatsContainer();
        }

        const el: HTMLElement | null = document.getElementById('time-center');
        if (el) {
            el.innerHTML = `${time}`;
            return;
        }

        const timeCenter: HTMLDivElement = document.createElement('div');
        timeCenter.classList.add('flex', 'justify-center');
        timeCenter.innerHTML = `<div class="m-4 p-4 text-white text-2xl rounded-xl bg-black bg-opacity-80" id="time-center">${time}</div>`;
        container.appendChild(timeCenter);
    }

    winnerEnding(el: HTMLElement): void {
        // can be multiple images, so we pick one randomly
        const length = this.game.assets.winner.length;
        const image = this.game.assets.winner[Math.floor(Math.random() * length)];

        const popup: HTMLDivElement = document.createElement('div');
        popup.id = 'winner-popup';
        const cls: string[] = [
            'bg-white', 'rounded-xl', 'p-4', 'text-center', 'text-2xl', 'text-black', 'w-full', 'max-w-lg', 'ring-2', 'ring-offset-4', 'ring-teal-200', 'ring-offset-teal-700',
            'animate-wiggle', 'animate-thrice', 'animate-duration-1000', 'animate-delay-0', 'animate-ease-in-out', 'animate-alternate-reverse', 'animate-fill-both',
        ];

        const messageLength: number = this.game.config.winner_messages;
        const message = Math.floor(Math.random() * messageLength) + 1;

        popup.classList.add(...cls);
        popup.innerHTML = `
                <p class="text-teal-700 text-3xl font-medium uppercase mt-6 mb-12 animate-shake animate-thrice animate-duration-[1500ms] animate-delay-1000 animate-ease-in-out animate-alternate-reverse animate-fill-both">${__('screens.winner.title')}</p>
                <img src="${image}" alt="Image" class="w-52 rounded-lg mx-auto animate-jump animate-infinite animate-duration-[2000ms] animate-delay-100 animate-ease-linear animate-alternate-reverse animate-fill-both">
                <p class="text-xl font-medium uppercase mt-12 mb-6 animate-jump-out animate-once animate-duration-[2000ms] animate-delay-[2000ms] animate-ease-linear animate-alternate-reverse animate-fill-both">${__('screens.winner.message.' + message)}</p>
        `;
        setTimeout(() => {
            this.game.speecher.speak(__('screens.winner.title') + '... ' + __('screens.winner.message.' + message));
        }, 3e3)

        el.innerHTML = '';
        el.appendChild(popup);
    }

    loserEnding(el: HTMLElement): void {
        // can be multiple images, so we pick one randomly
        const length = this.game.assets.loser.length;
        const image = this.game.assets.loser[Math.floor(Math.random() * length)];

        const popup: HTMLDivElement = document.createElement('div');
        popup.id = 'loser-popup';
        const cls: string[] = [
            'bg-white', 'rounded-xl', 'p-4', 'text-center', 'text-2xl', 'text-black', 'w-full', 'max-w-lg', 'ring-2', 'ring-offset-4', 'ring-rose-200', 'ring-offset-rose-700',
            'animate-wiggle', 'animate-thrice', 'animate-duration-1000', 'animate-delay-0', 'animate-ease-in-out', 'animate-alternate-reverse', 'animate-fill-both',
        ];

        const messageLength: number = this.game.config.loser_messages;
        const message = Math.floor(Math.random() * messageLength) + 1;

        popup.classList.add(...cls);
        popup.innerHTML = `
                <p class="text-rose-700 text-3xl font-medium uppercase mt-6 mb-12 animate-shake animate-thrice animate-duration-[1500ms] animate-delay-1000 animate-ease-in-out animate-alternate-reverse animate-fill-both">${__('screens.loser.title')}</p>
                <img src="${image}" alt="Image" class="w-52 rounded-lg mx-auto animate-jump animate-infinite animate-duration-[2000ms] animate-delay-100 animate-ease-linear animate-alternate-reverse animate-fill-both">
                <p class="text-xl font-medium uppercase mt-12 mb-6 animate-jump-out animate-once animate-duration-[2000ms] animate-delay-[2000ms] animate-ease-linear animate-alternate-reverse animate-fill-both">${__('screens.loser.message.' + message)}</p>
        `;

        setTimeout(() => {
            this.game.speecher.speak(__('screens.loser.title_short') + '... ' + __('screens.loser.message.' + message));
        }, 1e3);

        el.innerHTML = '';
        el.appendChild(popup);
    }

    endScreen(win: boolean = false): void {
        if (!this.element) return;
        const el: HTMLElement | null = document.getElementById('end-screen')
        if (el) {
            if (win) {
                this.winnerEnding(el);
            } else {
                this.loserEnding(el);
            }
            el.classList.remove('hidden');
            return;
        }

        const endScreen: HTMLDivElement = document.createElement('div');
        endScreen.id = 'end-screen';
        endScreen.classList.add('fixed', 'inset-0', 'flex', 'justify-center', 'items-center', 'bg-white', 'bg-opacity-30', 'z-50', 'text-white', 'text-2xl')
        if (win) {
            this.winnerEnding(endScreen);
        } else {
            this.loserEnding(endScreen);
        }

        this.game.listeners.addListenerTouchToRestart(endScreen).then((): void => {
        });

        this.element.appendChild(endScreen);
    }

    hideEndScreen(): void {
        const el: HTMLElement | null = document.getElementById('end-screen');
        if (!el) return;

        el.classList.add('hidden');
    }
}
