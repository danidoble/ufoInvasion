import {Screens} from "./screens.ts";
import {SoundPlayer} from "./soundPlayer.ts";
import {Dispatcher} from "./dispatcher.ts";
import {Listeners} from "./listeners.ts";
import dayjs from 'dayjs';
import {config, defaultConfiguration, difficulty, assets, sounds} from "../types/types.ts";
import {IConfig} from "../interfaces/IConfig.ts";
import {Speecher} from "./speecher.ts";

export class Config extends Dispatcher implements IConfig {
    public element: string = 'body';
    public focused: boolean = true;

    public dayjs = dayjs;

    public paused: boolean = false;
    public game_over: boolean = false;
    public win: boolean = false;
    public playing: boolean = false;

    public screens: Screens = new Screens();
    public player: SoundPlayer = new SoundPlayer();
    public listeners: Listeners = new Listeners(this);
    public speecher: Speecher = new Speecher();

    public assets: assets = {
        background: 'background/bg.jpg',
        bird: 'models/bird/owl.glb',
        ufo: 'models/ufo/ovni.glb',
        coin: 'models/coin/coin.glb',
        fonts: 'fonts/helvetiker_regular.typeface.json',
        tap: 'images/dare_to_dream.svg',
        winner: [
            'images/winner/1.svg',
            'images/winner/2.svg',
            'images/winner/3.svg',
            'images/winner/4.svg',
            'images/winner/5.svg',
            'images/winner/6.svg',
            'images/winner/7.svg',
            'images/winner/8.svg',
            'images/winner/9.svg',
            'images/winner/10.svg',
            'images/winner/11.svg',
            'images/winner/12.svg',
            'images/winner/13.svg',
            'images/winner/14.svg',
            'images/winner/15.svg',
            'images/winner/16.svg',
            'images/winner/17.svg',
            'images/winner/18.svg',
        ],
        loser: [
            'images/loser/1.svg',
            'images/loser/2.svg',
            'images/loser/3.svg',
            'images/loser/4.svg',
            'images/loser/5.svg',
            'images/loser/6.svg',
            'images/loser/7.svg',
            'images/loser/8.svg',
            'images/loser/9.svg',
            'images/loser/10.svg',
            'images/loser/11.svg',
            'images/loser/12.svg',
        ],
    }

    public sounds: sounds = {
        point: 'sounds/sfx_point.wav',
        hit: 'sounds/sfx_hit.wav',
        flying: 'sounds/sfx_wing.wav',
        loser: 'sounds/loser/spongebob-fail.mp3',
        high_difficulty: 'sounds/sfx_high_difficulty.mp3',
        wannaCry_difficulty: 'sounds/sfx_wannaCry_difficulty.mp3',
        winner: 'sounds/winner/sfx_winner.mp3',
    }

    public config: config = {
        debug: false,
        collision_boxes: false,
        storage_prefix: 'ufo_invasion',
        winner_messages: 21,
        loser_messages: 22,

        exposure: {
            day: 1,
            night: 0.1,
            change_every_seconds: 3000, // seconds
            change: false,
        },

        camera: {
            zoom: 84,
            fov: 75,
            near: 0.1,
            far: 1000,
            lookAt: {
                x: 0,
                y: 0,
                z: 0,
            },
            position: {
                x: 0,
                y: 0,
                z: 10,
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0,
            }
        },
        light: {
            ambient: {
                color: 0xffffff,
                intensity: 0.5
            },
            directional: {
                color: 0xffffff,
                intensity: 1,
                position: {
                    x: 1,
                    y: 0,
                    z: 1,
                }
            }
        },
        bird: {
            velocity: {
                x: 0,
                y: 5,
                z: 0,
            },
            position: {
                x: 1,
                y: 0,
                z: 0,
            },
            scale: {
                x: 0.5,
                y: 0.5,
                z: 0.5,
            }
        },
        ufo: {
            position: {
                x: -3.5, // -2
                y: 3, // 0.5
                z: 0,
            },
            scale: {
                x: 0.09,
                y: 0.09,
                z: 0.09,
            }
        },
        coin: {
            scale: {
                x: 0.081,
                y: 0.081,
                z: 0.081,
            }
        },

        difficulty: {
            selected: 'medium',
            easy: {
                min_enemy: 6,
                max_enemy: 12,
                velocity: 0.08,
                gravity: -9.82,
                min_bonus: 1,
                max_bonus: 5,
            },
            medium: {
                min_enemy: 8,
                max_enemy: 18,
                velocity: 0.1,
                gravity: -9.82,
                min_bonus: 1,
                max_bonus: 5,
            },
            hard: {
                min_enemy: 5,
                max_enemy: 20,
                velocity: 0.16,
                gravity: -9.82,
                min_bonus: 1,
                max_bonus: 5,
            },
            extreme: {
                min_enemy: 2,
                max_enemy: 30,
                velocity: 0.22,
                gravity: -20,
                min_bonus: 1,
                max_bonus: 5,
            },
            legend: {
                min_enemy: 5,
                max_enemy: 30,
                velocity: 0.5,
                gravity: -30,
                min_bonus: 1,
                max_bonus: 5,
            },
            wannaCry: {
                min_enemy: 6,
                max_enemy: 14,
                velocity: 0.08,
                gravity: -100,
                min_bonus: 1,
                max_bonus: 5,
            },
        },

        internal: {
            dimensions: {
                instance: this,
                width() {
                    return window.innerWidth / this.instance.config.camera.zoom
                },
                height() {
                    return window.innerHeight / this.instance.config.camera.zoom
                },
                x(inverse: boolean = false): number {
                    const adjust_px: number = inverse ? 30 : -30;

                    return (window.innerWidth / 2 + adjust_px) / this.instance.config.camera.zoom
                },
                y(inverse: boolean = false): number {
                    const adjust_px: number = inverse ? 30 : -30;

                    return (window.innerHeight / 2 + adjust_px) / this.instance.config.camera.zoom
                }
            }
        },

        limit_time: 0, // 0 no limit
        limit_score: 0, // 0 no limit
        survival: false,

        credits: {
            message: 'Created by\n danidoble.',
            color: 0x000000,
        },
    };

    constructor(element: string = 'body', configuration: defaultConfiguration = {
        debug: false, collisionBoxes: false,
    }) {
        super();

        this.config.debug = configuration.debug;
        this.element = element;

        this.config.collision_boxes = configuration.collisionBoxes;

        this.screens.configure(this);
        this.screens.loading();
        this.player.configure(this);
    }

    checkExistDifficulty(difficulty: string): string {
        // @ts-ignore
        if (!this.config.difficulty[difficulty]) { // check if selected is valid
            console.warn(`Difficulty ${difficulty} not found, using easy`);
            this.config.difficulty.selected = 'easy';
            return 'easy';
        }
        return difficulty;
    }

    setDifficulty(difficulty: string): void {
        difficulty = this.checkExistDifficulty(difficulty);

        this.config.difficulty.selected = difficulty;
    }

    getDifficulty(): string {
        return this.config.difficulty.selected;
    }

    getDifficultyConfig(difficulty: string = 'easy'): difficulty {
        difficulty = this.checkExistDifficulty(difficulty);

        // @ts-ignore
        return this.config.difficulty[difficulty];
    }

    setScoreLimit(score: number): void {
        this.config.limit_score = score;
    }

    setTimeLimit(seconds: number): void {
        this.config.limit_time = seconds;
    }

    setSurvivalMode(survival: boolean): void {
        this.config.survival = survival;
    }

    getLimitTime(): number {
        return this.config.limit_time;
    }

    setDebug(debug: boolean): void {
        this.config.debug = debug;
    }

    getDebug(): boolean {
        return this.config.debug;
    }

    getCollisionBoxes(): boolean {
        return this.config.collision_boxes;
    }

    setFocus(focused: boolean): void {
        this.focused = focused;
    }

    isFocused(): boolean {
        return this.focused;
    }
}
