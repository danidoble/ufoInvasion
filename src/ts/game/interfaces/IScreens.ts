export interface IScreens {
    game: any
    elementSelector: string
    element: HTMLElement

    configure(game: any): void;

    loading(): void;

    removeLoading(): void;

    tapToStartScreen(): void;

    isTapToStartScreen(): boolean;

    isTapToRestartScreen(): boolean;

    hideTapToStartScreen(): void;

    pausedScreen(): void;

    hidePausedScreen(): void;

    restartScreen(): void;

    hideRestartScreen(): void;

    paused(paused: boolean): void;

    scoreCorner(score: number): void;

    timeCenter(time: number): void;

    winnerEnding(el: HTMLElement): void;

    loserEnding(el: HTMLElement): void;

    endScreen(win: boolean): void;

    hideEndScreen(): void;

    addStatsContainer(): HTMLDivElement;
}