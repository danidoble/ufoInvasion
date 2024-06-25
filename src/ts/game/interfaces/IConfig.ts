import {SoundPlayer} from "../classes/soundPlayer.ts";
import {Screens} from "../classes/screens.ts";
import {config, difficulty, assets, sounds} from "./../types/types.ts";
import {Speecher} from "../classes/speecher.ts";
import {Listeners} from "../classes/listeners.ts";

export interface IConfig {
    element: string,
    focused: boolean,
    paused: boolean;
    game_over: boolean;
    win: boolean;
    playing: boolean;
    dayjs: any;

    config: config,
    assets: assets,
    sounds: sounds,
    player: SoundPlayer,
    screens: Screens,
    listeners: Listeners,
    speecher: Speecher,

    checkExistDifficulty(difficulty: string): string,

    setDifficulty(difficulty: string): void,

    getDifficulty(): string,

    getDifficultyConfig(difficulty: string): difficulty,

    setScoreLimit(score: number): void,

    setTimeLimit(seconds: number): void,

    setSurvivalMode(survival: boolean): void,

    getLimitTime(): number,

    setDebug(debug: boolean): void,

    getDebug(): boolean,

    getCollisionBoxes(): boolean,

    setFocus(focused: boolean): void,

    isFocused(): boolean,
}