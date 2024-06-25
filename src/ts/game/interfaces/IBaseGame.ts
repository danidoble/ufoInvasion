import dayjs from "dayjs";
import * as THREE from "three";
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from "three/addons";
import {WebGLRenderer} from "three";
import {timestamps, ShakeObject, credits, MeshBodyModel, scoreStats} from "./../types/types.ts";
import CANNON from "cannon-es";

export interface IBaseGame {
    changed_exposure: dayjs.Dayjs
    creditsText: credits;

    clock: THREE.Clock;
    renderer: WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    ambientLight: THREE.AmbientLight;
    directionalLight: THREE.DirectionalLight;
    loader: GLTFLoader;
    controls: OrbitControls | undefined;
    shaker: ShakeObject;

    world: CANNON.World;
    groundShape: CANNON.Plane;
    groundBody: CANNON.Body | undefined;
    ceilingBody: CANNON.Body | undefined;
    birdShape: CANNON.Box | CANNON.Sphere | undefined;
    birdBody: CANNON.Body | undefined;
    gravity: number;
    birdMesh: THREE.Mesh | undefined;
    UFOsMeshBodies: any[];

    bird: any;
    ufo: any;
    coin: any;
    bonus: any[];

    score: number;
    high_score: number;
    score_stats: scoreStats

    mixerBird: THREE.AnimationMixer | undefined;
    mixerUFO: THREE.AnimationMixer | undefined;

    timestamps: timestamps

    backgroundTexture: THREE.Texture | null;
    backgroundScene: THREE.Scene | null;
    backgroundCamera: THREE.OrthographicCamera | null;
    backgroundMaterial: THREE.MeshBasicMaterial | null;
    planeGeometry: THREE.PlaneGeometry | null;
    background1: THREE.Mesh | null;
    background2: THREE.Mesh | null;


    configureLight(): void;

    configureRender(): void;

    cameraRestore(): void;

    initCamera(): Promise<void>

    adjustCamera(): void;

    makeGround(birdMaterial: CANNON.Material): void;

    makeCeiling(groundMaterial: CANNON.Material): void;

    initBirdShape(): void;

    initOrbitControls(): void;

    init(): Promise<void>;

    animateUpdateBird(delta: number, frustum: THREE.Frustum): void;

    animateUpdateUFO(delta: number, frustum: THREE.Frustum): void;

    respawnBonus(coin: MeshBodyModel): void;

    animateUpdateBonus(oldScore: number, frustum: THREE.Frustum): void;

    getFrustum(): THREE.Frustum;

    moveCredits(): void;

    changeExposure(): void;

    animateUpdateElapsedTime(): void;

    animateUpdateScore(oldScore: number): void;

    animateCheckEnd(): void;

    animateUpdateRenderer(): void;

    animateUpdateBackground(): void;

    animate(): void;

    gameOver(): void;

    start(): Promise<void>;

    restart(): Promise<void>;

    initLight(): Promise<void>;

    initModels(): Promise<void>;

    initBird(): Promise<any>;

    startMixerBird(): Promise<void>;

    stopMixerBird(): void;

    playMixerBird(): void;

    updateMixerBird(delta: number): void;

    initUFO(): Promise<any>;

    updateMixerUFO(delta: number): void;

    stopMixerUFO(): void;

    playMixerUFO(): void;

    initCoin(): Promise<any>;

    stopAnimations(): void;

    startAnimations(): void;

    onWindowResize(): void;

    isInView(frustum: THREE.Frustum, object: any): boolean;

    birdTap(): Promise<void>;

    pause(): void;

    disableGravity(): void;

    enableGravity(): void;

    addMeshBodyBonus(): void;

    addMeshBodyUFO(): void;

    moveUFOs(): void;

    moveBonus(): void;

    checkCollision(body1: any, body2: any): boolean;

    after1SecondCameraBackToNormal(): void;

    hitShake(obstacle: any): void;

    ScreenShake(): ShakeObject;

    initGravity(): void;

    calcElapsedTime(): void;

    getScore(): number;

    getElapsedTime(): number;

    timeout(): boolean;

    coinVictory(): boolean;

    checkWin(): boolean;

    statisticsEnd(): any;

    credits(): void;

    isPlaying(): boolean;

    isPaused(): boolean;

    loadBackgroundModel(): Promise<any>

    initBackground(): Promise<void>

    infiniteScrollBackground(): void

    backgroundResize(): void

    onWindowResize(): void

    clearHighScore(): void
}
