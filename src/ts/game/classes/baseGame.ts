import * as THREE from 'three';
import {WebGLRenderer} from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from "three/addons";
import {Config} from "./config.ts";
import * as CANNON from 'cannon-es';
import dayjs from 'dayjs';
import {SVGLoader} from 'three/addons/loaders/SVGLoader.js';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {
    timestamps,
    ShakeObject,
    credits,
    MeshBodyModel,
    scoreStats,
    defaultConfiguration,
    difficulty,
    position,
    ErrorType
} from "./../types/types.ts";
import {IBaseGame} from "../interfaces/IBaseGame.ts";

export class BaseGame extends Config implements IBaseGame {
    public changed_exposure: dayjs.Dayjs = this.dayjs();
    public creditsText: credits = {
        text: null,
        stroke: null,
    };

    public clock: THREE.Clock = new THREE.Clock();
    public renderer: WebGLRenderer = new THREE.WebGLRenderer({antialias: false, alpha: true});
    public scene: THREE.Scene = new THREE.Scene();
    public camera: THREE.PerspectiveCamera | THREE.OrthographicCamera = new THREE.OrthographicCamera();
    public ambientLight: THREE.AmbientLight = new THREE.AmbientLight(this.config.light.ambient.color, this.config.light.ambient.intensity);
    public directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(this.config.light.directional.color, this.config.light.directional.intensity);
    public loader: GLTFLoader = new GLTFLoader();
    public controls: OrbitControls | undefined;
    public shaker: ShakeObject = this.ScreenShake();

    public world: CANNON.World = new CANNON.World();
    public groundShape: CANNON.Plane = new CANNON.Plane();
    public groundBody: CANNON.Body | undefined;
    public ceilingBody: CANNON.Body | undefined;
    public birdShape: CANNON.Box | CANNON.Sphere | undefined;
    public birdBody: CANNON.Body | undefined;
    public gravity: number = -9.81;
    public birdMesh: THREE.Mesh | undefined;
    public UFOsMeshBodies: any[] = [];

    public bird: any;
    public ufo: any;
    public coin: any;
    public bonus: any[] = [];

    public score: number = 0;
    public high_score: number = 0;
    public score_stats: scoreStats = {
        bonus: 0,
        hits: 0,
        time: 0,
    }

    public mixerBird: THREE.AnimationMixer | undefined;
    public mixerUFO: THREE.AnimationMixer | undefined;

    public timestamps: timestamps = {
        start: null,
        end: null,
        elapsed: 0,
        elapsed_full: 0,
        paused_time: 0,
        last_pause: {
            start: null,
            end: null,
            elapsed: 0,
        },
    };

    public backgroundTexture: THREE.Texture | null = null;
    public backgroundScene: THREE.Scene | null = null;
    public backgroundCamera: THREE.OrthographicCamera | null = null;
    public backgroundMaterial: THREE.MeshBasicMaterial | null = null;
    public planeGeometry: THREE.PlaneGeometry | null = null;
    public background1: THREE.Mesh | null = null;
    public background2: THREE.Mesh | null = null;

    constructor(
        element: string = 'body',
        configuration: defaultConfiguration = {
            debug: false, collisionBoxes: false,
        }
    ) {
        super(element, configuration);
        this.initGravity()
        this.configureLight();
        this.initOrbitControls();
        this.initBirdShape();
        this.configureRender();
    }

    configureLight(): void {
        this.directionalLight.color.convertSRGBToLinear();
    }

    configureRender(): void {
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.toneMappingExposure = this.config.exposure.day;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.listeners.addListenerClickTap(this.renderer.domElement).then(() => {
        });

        const el: HTMLElement = document.querySelector(this.element) || document.body;
        el.appendChild(this.renderer.domElement);

        this.renderer.setAnimationLoop(() => {
            this.animate();
        });
    }

    cameraRestore(): void {
        this.camera.position.set(this.config.camera.position.x, this.config.camera.position.y, this.config.camera.position.z);
        this.camera.lookAt(this.config.camera.lookAt.x, this.config.camera.lookAt.y, this.config.camera.lookAt.z);
    }

    async initCamera(): Promise<void> {
        this.camera.near = this.config.camera.near;
        this.camera.far = this.config.camera.far;
        this.camera.zoom = this.config.camera.zoom;
        if (!(this.camera instanceof THREE.OrthographicCamera)) {
            this.camera.fov = this.config.camera.fov;
            this.camera.aspect = window.innerWidth / window.innerHeight;
        }
        this.camera.position.z = this.config.camera.position.z;
        this.camera.position.y = this.config.camera.position.y;
        this.camera.rotation.x = this.config.camera.rotation.x;
        this.camera.rotation.y = this.config.camera.rotation.y;

        this.cameraRestore();
        this.adjustCamera();
    }

    adjustCamera(): void {
        if (!this.renderer) return;

        if (!(this.camera instanceof THREE.OrthographicCamera)) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
        } else {
            this.camera.left = window.innerWidth / -2;
            this.camera.right = window.innerWidth / 2;
            this.camera.top = window.innerHeight / 2;
            this.camera.bottom = window.innerHeight / -2;
        }

        this.camera.updateProjectionMatrix();
    }

    makeGround(birdMaterial: CANNON.Material): void {
        // @ts-ignore
        const width: number = this.config.internal.dimensions.width();
        // @ts-ignore
        const height: number = this.config.internal.dimensions.height();
        // @ts-ignore
        const y: number = -this.config.internal.dimensions.y(true);

        const groundMesh: THREE.Mesh<THREE.PlaneGeometry> = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshStandardMaterial({
            color: 0x000000,
            visible: this.config.collision_boxes,
            transparent: true,
            opacity: 0.5,
            depthWrite: false
        }));
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.position.y = y;

        const groundMaterial = new CANNON.Material({friction: 0, restitution: 0.7});
        this.world.addContactMaterial(new CANNON.ContactMaterial(birdMaterial, groundMaterial, {
            friction: 0.5,
            restitution: 0.7
        }));

        this.groundBody = new CANNON.Body({
            mass: 0,
            shape: this.groundShape,
            position: new CANNON.Vec3(0, y, 0),
            material: groundMaterial
        });
        this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

        this.scene.add(groundMesh);
        this.world.addBody(this.groundBody);

        this.makeCeiling(groundMaterial);
    }

    makeCeiling(groundMaterial: CANNON.Material): void {
        // @ts-ignore
        const width: number = this.config.internal.dimensions.width();
        // @ts-ignore
        const height: number = this.config.internal.dimensions.height();
        // @ts-ignore
        const y: number = this.config.internal.dimensions.y();

        const ceilingMesh: THREE.Mesh<THREE.PlaneGeometry> = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshStandardMaterial({
            color: 0x000000,
            visible: this.config.collision_boxes,
            transparent: true,
            opacity: 0.5,
            depthWrite: false
        }));

        ceilingMesh.rotation.x = Math.PI / 2;
        ceilingMesh.position.y = y;

        this.ceilingBody = new CANNON.Body({
            mass: 0,
            shape: this.groundShape,
            position: new CANNON.Vec3(0, y, 0),
            material: groundMaterial
        });
        this.ceilingBody.quaternion.setFromEuler(Math.PI / 2, 0, 0);

        this.scene.add(ceilingMesh);
        this.world.addBody(this.ceilingBody);
    }

    initBirdShape(): void {
        this.birdMesh = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshStandardMaterial({
            color: 0xff0000,
            visible: this.config.collision_boxes,
            transparent: true,
            opacity: 0.5,
        }));
        this.birdMesh.castShadow = true;
        this.birdMesh.receiveShadow = true;
        this.birdMesh.position.set(this.config.bird.position.x, 0, 0);

        const birdMaterial: CANNON.Material = new CANNON.Material({friction: 1, restitution: 0.3});
        this.birdShape = new CANNON.Sphere(0.3);
        this.birdBody = new CANNON.Body({
            mass: 1,
            shape: this.birdShape,
            position: new CANNON.Vec3(this.config.bird.position.x, this.config.bird.position.y, this.config.bird.position.z),
            material: birdMaterial,
        });
        this.birdBody.quaternion.setFromEuler(Math.PI, 0, 0)

        this.scene.add(this.birdMesh);
        this.world.addBody(this.birdBody);
        this.makeGround(birdMaterial);
    }

    initOrbitControls(): void {
        if (!this.config.debug) return;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.enableZoom = true;
    }

    async init(): Promise<void> {
        const score: string = localStorage.getItem(`${this.config.storage_prefix}_score`) ?? '0';
        this.high_score = parseInt(score);
        await this.screens.addErrorsTemplates();

        await this.initCamera();
        await this.initLight();
        await this.initModels();
        await this.initBackground();

        this.game_over = true;
        this.playing = false;
        this.paused = false;
        this.disableGravity();
        this.stopAnimations();
        this.screens.tapToStartScreen();

        await this.listeners.configure();
        this.credits()

        this.screens.removeLoading();
        if (this.camera) {
            this.camera.updateProjectionMatrix();
        }
    }

    animateUpdateBird(delta: number, frustum: THREE.Frustum): void {
        this.updateMixerBird(delta);

        if (this.bird && this.birdMesh && this.birdBody && !this.game_over && !this.paused) {
            // prevent bird from moving in z axis
            this.birdBody.position.z = 0;
            this.birdBody.velocity.z = 0;

            this.birdMesh.position.copy(this.birdBody.position);
            this.bird.scene.position.copy(this.birdBody.position);
            this.bird.scene.position.y = this.birdBody.position.y - 0.4;


            this.birdBody.velocity.x = 0;
            this.birdBody.velocity.z = 0;

            if (this.paused) {
                this.birdBody.velocity.y = 0;
            }

            if (!this.isInView(frustum, this.birdMesh)) {
                if ((this.birdMesh.position.y <= 0 || this.birdMesh.position.x <= -5) && !this.game_over) {
                    this.dispatch('birdOut', {
                        position: {
                            x: this.birdMesh.position.x,
                            y: this.birdMesh.position.y
                        }
                    });
                    this.gameOver()
                    this.hitShake();
                }
            }
        }
    }

    animateUpdateUFO(delta: number, frustum: THREE.Frustum): void {
        if (this.UFOsMeshBodies && this.ufo) {
            for (const ufo of this.UFOsMeshBodies) {
                ufo.body.position.z = 0;

                ufo.mesh.position.copy(ufo.body.position);
                ufo.model.position.copy(ufo.body.position);
                ufo.model.position.y = ufo.body.position.y - 0.7;
                ufo.model.quaternion.copy(ufo.body.quaternion);
            }
        }

        this.updateMixerUFO(delta);
        this.moveUFOs();

        if (this.UFOsMeshBodies && this.birdBody) {
            for (const ufo of this.UFOsMeshBodies) {

                if (this.checkCollision(ufo.body, this.birdBody)) {
                    this.score_stats.hits += 1;
                    if ((['hard', 'extreme', 'legend', 'wannaCry']).includes(this.config.difficulty.selected)) {
                        // const strength: number = 500
                        // const dt: number = 0.2;
                        const strength: number = ({
                            hard: 50,
                            extreme: 100,
                            legend: 200,
                            wannaCry: 500,
                        })[this.config.difficulty.selected] ?? 50;
                        const dt: number = 0.2;

                        this.birdBody.applyImpulse(new CANNON.Vec3(-strength * dt, 0, 0), new CANNON.Vec3(0, 1, 0));
                    }
                    this.hitShake(ufo);
                }

                if (!(!this.isInView(frustum, ufo.mesh) && ufo.mesh.position.x <= 0)) {
                    continue;
                }

                const [position] = this.bountyEnemiesSpawnPosition();
                // @ts-ignore
                const y: number = position.y;
                // @ts-ignore
                const x: number = position.x;

                ufo.mesh.position.x = x;
                ufo.mesh.position.y = y;
                ufo.body.position.x = x;
                ufo.body.position.y = y;
                ufo.model.position.x = x;
                ufo.model.position.y = y - 0.7;

                if (this.UFOsMeshBodies.length < this.getDifficultyConfig(this.config.difficulty.selected).max_enemy) {
                    this.addMeshBodyUFO();
                }
            }
        }
    }

    respawnBonus(coin: MeshBodyModel): void {
        const [position] = this.bountyEnemiesSpawnPosition();
        // @ts-ignore
        const y: number = position.y;
        // @ts-ignore
        const x: number = position.x;

        coin.mesh.position.y = y;
        coin.mesh.position.x = x;
        coin.body.position.y = y;
        coin.body.position.x = x;
        coin.model.position.y = y;
        coin.model.position.x = x;

        if (this.bonus.length < this.getDifficultyConfig(this.config.difficulty.selected).max_bonus) {
            this.addMeshBodyBonus();
        }
    }

    animateUpdateBonus(oldScore: number, frustum: THREE.Frustum): void {
        if (this.bonus.length > 0 && this.coin) {
            for (const coin of this.bonus) {
                coin.body.position.z = 0;

                coin.mesh.position.copy(coin.body.position);
                coin.mesh.position.y = coin.body.position.y - 0.4;
                coin.mesh.quaternion.copy(coin.body.quaternion);
                coin.model.position.copy(coin.body.position);
                coin.model.position.y = coin.body.position.y - 0.7;
                coin.model.rotation.y -= 0.03;
            }
        }

        this.moveBonus();

        if (this.bonus) {
            for (const coin of this.bonus) {

                if (this.checkCollision(coin.body, this.birdBody)) {
                    this.score += 1;
                    this.score_stats.bonus += 1;
                    this.dispatch('bonusPicked', {score: this.score, oldScore: oldScore});
                    this.player.play('point').then((): void => {
                    });

                    this.respawnBonus(coin);
                    continue;
                }

                if (!(!this.isInView(frustum, coin.mesh) && coin.mesh.position.x <= 0)) {
                    continue;
                }

                this.respawnBonus(coin);
            }
        }
    }

    getFrustum(): THREE.Frustum {
        const frustum: THREE.Frustum = new THREE.Frustum();
        const cameraViewProjectionMatrix: THREE.Matrix4 = new THREE.Matrix4();
        this.camera.updateMatrixWorld();
        cameraViewProjectionMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
        frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);
        return frustum;
    }

    moveCredits(): void {
        if (this.creditsText.text && this.creditsText.stroke) {
            this.creditsText.text.position.x -= 0.01;
            //this.creditsText.stroke.position.x -= 0.01;

            // @ts-ignore
            const width: number = this.config.internal.dimensions.width() / 2;

            if (this.creditsText.text.position.x < -width) {
                this.creditsText.text.position.x = width;
                //this.creditsText.stroke.position.x = width;
            }
        }
    }

    changeExposure(): void {
        if (this.game_over || this.paused || !this.config.exposure.change) return;

        const now: dayjs.Dayjs = this.dayjs();
        if (now.diff(this.changed_exposure, 'second') > this.config.exposure.change_every_seconds / 1000) {
            this.changed_exposure = now;
            if (this.renderer.toneMappingExposure === this.config.exposure.day) {
                this.renderer.toneMappingExposure = this.config.exposure.night;
            } else {
                this.renderer.toneMappingExposure = this.config.exposure.day;
            }
        }
    }

    animateUpdateElapsedTime(): void {
        if (this.game_over || this.paused) return;

        this.calcElapsedTime();

        if (this.getLimitTime() > 0) {
            this.screens.timeCenter(`${this.getElapsedTime()}/${this.getLimitTime()}`);
        } else {
            this.screens.timeCenter(this.getElapsedTime(true).toFixed(2));
        }
    }

    animateUpdateScore(oldScore: number): void {
        if (this.game_over || this.paused) return;

        if (this.score > oldScore) {
            this.screens.scoreCorner(this.score);
        }

        if (this.score > this.high_score) {
            this.high_score = this.score;
            this.screens.highScoreCorner(this.high_score);
        }
    }

    animateCheckEnd(): void {
        if (this.game_over || this.paused) return;

        if (this.checkWin()) {
            this.win = true;
            this.gameOver();
        } else if (this.timeout()) {
            this.win = false;
            this.gameOver();
        }
    }

    animateUpdateRenderer() {
        this.renderer.autoClear = false;
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
    }

    animateUpdateBackground(): void {
        this.infiniteScrollBackground();
        if (this.backgroundScene && this.backgroundCamera) {
            this.renderer.render(this.backgroundScene, this.backgroundCamera);
        }
    }

    animate(): void {
        const delta: number = this.clock.getDelta();
        const oldScore: number = this.score;
        const frustum: THREE.Frustum = this.getFrustum();

        this.shaker.update(this.camera);

        if (this.world) {
            this.world.step(1 / 60);
        }

        this.animateUpdateBird(delta, frustum);
        this.animateUpdateUFO(delta, frustum);
        this.animateUpdateBonus(oldScore, frustum);
        this.moveCredits();
        this.changeExposure();
        this.animateUpdateElapsedTime();
        this.animateUpdateScore(oldScore);
        this.animateCheckEnd();
        this.animateCheckEnd();
        this.animateUpdateRenderer();
        this.animateUpdateBackground();
    }

    gameOver(): void {
        this.timestamps.end = dayjs();
        this.calcElapsedTime();
        this.playing = false;

        if (this.score > this.high_score) {
            this.high_score = this.score;
            localStorage.setItem(`${this.config.storage_prefix}_score`, this.high_score.toString());
        }

        if (!this.win) {
            this.player.play('loser').then(() => {
            });
        } else {
            this.player.play('winner').then(() => {
            });
        }
        this.game_over = true;
        this.disableGravity();
        this.restoreBirdImpulse();
        this.stopAnimations();

        this.screens.endScreen(this.win);
        this.screens.highScoreCorner(this.high_score);
        this.dispatch('gameOver', this.statisticsEnd());
    }

    restoreBirdImpulse(): void {
        if (this.birdBody) {
            this.birdBody.velocity.set(0, 0, 0);
            this.birdBody.angularVelocity.set(0, 0, 0);
            this.birdBody.quaternion.setFromEuler(0, 0, 0);
        }
    }

    async start(): Promise<void> {
        this.restoreBirdImpulse();
        this.initGravity()
        this.world.gravity.set(0, this.gravity, 0);
        this.game_over = false;
        this.screens.hideTapToStartScreen();
        this.screens.hideEndScreen()
        this.timestamps.start = dayjs();
        this.timestamps.end = null;
        this.timestamps.elapsed = 0;
        this.timestamps.paused_time = 0;
        this.timestamps.last_pause = {
            start: null,
            end: null,
            elapsed: 0,
        };
        this.playing = true;

        this.startAnimations()

        const difficulty: string = this.config.difficulty.selected;
        const config: difficulty = this.getDifficultyConfig(difficulty);

        if ((['extreme', 'legend']).includes(difficulty)) {
            this.player.play('high_difficulty').then((): void => {
            });
        } else if ((['wannaCry']).includes(difficulty)) {
            this.player.play('wannaCry_difficulty').then((): void => {
            });
        }

        for (let i = 0; i < config.min_enemy; i++) {
            this.addMeshBodyUFO();
        }
        for (let i = 0; i < config.min_bonus; i++) {
            this.addMeshBodyBonus();
        }

        this.screens.highScoreCorner(this.high_score);
        this.screens.scoreCorner(this.score);
        this.dispatch('started', {at: this.dayjs().format('YYYY-MM-DD HH:mm:ss')});
    }

    async restart(): Promise<void> {
        this.player.stopAll();
        this.win = false;
        this.score = 0;
        this.score_stats = {
            bonus: 0,
            hits: 0,
            time: 0,
        }

        if (this.birdBody && this.bird && this.birdMesh) {
            this.birdBody.position.set(this.config.bird.position.x, 0, 0);
        }

        if (this.UFOsMeshBodies.length > 0) {
            for (const ufo of this.UFOsMeshBodies) {
                this.scene.remove(ufo.mesh);
                this.world.removeBody(ufo.body);
                this.scene.remove(ufo.model);
            }
            this.UFOsMeshBodies = [];
        }

        if (this.bonus.length > 0) {
            for (const bonus of this.bonus) {
                this.scene.remove(bonus.mesh);
                this.world.removeBody(bonus.body);
                this.scene.remove(bonus.model);
            }
            this.bonus = [];
        }
        this.screens.hideEndScreen();
        this.screens.hideRestartScreen();
        this.screens.tapToStartScreen();
    }

    async initLight(): Promise<void> {
        this.directionalLight.position.set(this.config.light.directional.position.x, this.config.light.directional.position.y, this.config.light.directional.position.z).normalize();
        this.scene.add(this.ambientLight);
        this.scene.add(this.directionalLight);
    }

    async initModels(): Promise<void> {
        let error: ErrorType = {
            bird: false,
            ufo: false,
            background: false,
            coin: false,
        };
        await this.initBird().catch((e): void => {
            console.assert(!this.config.debug, e);
            error.bird = true;
        });
        await this.initCoin().catch((e): void => {
            console.assert(!this.config.debug, e);
            error.coin = true;
        });
        await this.initUFO().catch((e): void => {
            console.assert(!this.config.debug, e);
            error.ufo = true;
        });
        await this.loadBackgroundModel().catch((e): void => {
            console.assert(!this.config.debug, e);
            error.background = true;
        });

        if (error.bird || error.ufo || error.background || error.coin) {
            await this.screens.displayError('error-loading-model', error);
        }
    }

    async initBird(): Promise<any> {
        let this1 = this;
        return new Promise((resolve, reject): void => {
            this.loader.load(this.assets.bird, (bird): void => {
                this1.bird = bird;
                this1.bird.scene.scale.set(this1.config.bird.scale.x, this1.config.bird.scale.y, this1.config.bird.scale.z);
                this1.bird.scene.position.set(this1.config.bird.position.x, this1.config.bird.position.y, this1.config.bird.position.z);
                this1.scene.add(bird.scene);
                this1.startMixerBird();
                resolve(true);
            }, undefined, (error): void => { // on error
                reject(error);
            });
        });
    }

    async startMixerBird(): Promise<void> {
        if (!this.bird && this.bird.animations.length === 0) return;

        this.mixerBird = new THREE.AnimationMixer(this.bird.scene);
        this.mixerBird.clipAction(this.bird.animations[0]).play();
    }

    stopMixerBird(): void {
        if (this.mixerBird) {
            this.mixerBird.stopAllAction();
        }
    }

    playMixerBird(): void {
        if (this.mixerBird) {
            this.mixerBird.clipAction(this.bird.animations[0]).play();
        }
    }

    updateMixerBird(delta: number): void {
        if (this.mixerBird) {
            this.mixerBird.update(delta);
        }
    }

    async initUFO(): Promise<any> {
        let this1 = this;
        return new Promise((resolve, reject): void => {
            this.loader.load(this.assets.ufo, (ufo): void => {
                this1.ufo = ufo;
                this1.ufo.scene.scale.set(this1.config.ufo.scale.x, this1.config.ufo.scale.y, this1.config.ufo.scale.z);
                this1.ufo.scene.position.set(this1.config.ufo.position.x, this1.config.ufo.position.y, this1.config.ufo.position.z);
                resolve(true);
            }, undefined, (error): void => {
                reject(error);
            });
        });
    }

    updateMixerUFO(delta: number): void {
        if (this.mixerUFO) {
            this.mixerUFO.update(delta);
        }
    }

    stopMixerUFO(): void {
        if (this.mixerUFO) {
            this.mixerUFO.stopAllAction();
        }
    }

    playMixerUFO(): void {
        if (this.mixerUFO) {
            this.mixerUFO.clipAction(this.ufo.animations[0]).play();
        }
    }

    async initCoin(): Promise<any> {
        let this1 = this;
        return new Promise((resolve, reject): void => {
            this.loader.load(this.assets.coin, (gltf): void => {
                this1.coin = gltf.scene;
                this1.coin.scale.set(this1.config.coin.scale.x, this1.config.coin.scale.y, this1.config.coin.scale.z);
                resolve(true);
            }, undefined, (error): void => {
                reject(error);
            });
        });
    }

    stopAnimations(): void {
        this.stopMixerBird();
        this.stopMixerUFO();
    }

    startAnimations(): void {
        this.playMixerBird();
        this.playMixerUFO();
    }

    onWindowResize(): void {
        if (!this.renderer) return;
        this.adjustCamera();
        this.backgroundResize();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    isInView(frustum: THREE.Frustum, object: any): boolean {
        const objectPosition: THREE.Vector3 = new THREE.Vector3();
        object.getWorldPosition(objectPosition);
        return frustum.containsPoint(objectPosition);
    }

    async birdTap(): Promise<void> {
        if (!this.birdBody || this.paused || this.game_over) return;

        this.birdBody.velocity.set(this.config.bird.velocity.x, this.config.bird.velocity.y, this.config.bird.velocity.z);
        this.player.play('flying').then((): void => {
        });
    }

    pause(): void {
        this.screens.paused(!this.paused);
        this.paused = !this.paused;

        if (this.paused) {
            this.timestamps.last_pause.start = dayjs();
            this.disableGravity();
        } else {
            this.timestamps.last_pause.end = dayjs();
            this.timestamps.last_pause.elapsed = this.timestamps.last_pause.end.diff(this.timestamps.last_pause.start);
            this.timestamps.paused_time += this.timestamps.last_pause.elapsed;
            this.enableGravity();
        }

        if (this.paused) {
            this.stopAnimations()
        } else {
            this.startAnimations()
        }
    }

    disableGravity(): void {
        this.gravity = 0;
        this.world.gravity.set(0, 0, 0);
        if (this.birdBody) {
            this.birdBody.velocity.set(0, 0, 0);
        }
    }

    enableGravity(): void {
        this.initGravity()
        this.world.gravity.set(0, this.gravity, 0);
    }

    bountyEnemiesSpawnPosition() {
        // @ts-ignore
        const width: number = this.config.internal.dimensions.width() / 2;
        // @ts-ignore
        const height: number = this.config.internal.dimensions.height() / 2;

        let x: number = Math.random() * ((width * 2) - width + 1) + width;
        if (x <= width) {
            x += 5;
        }
        const position: position = {
            y: Math.random() * (height - -height + 1) + -height,
            x: x,
            z: 0,
        }

        return [position, width, height];
    }

    addMeshBodyBonus(): void {
        const [position] = this.bountyEnemiesSpawnPosition();

        const bonus = this.coin.clone();
        const bonusMesh: THREE.Mesh<THREE.SphereGeometry> = new THREE.Mesh(new THREE.SphereGeometry(0.4), new THREE.MeshStandardMaterial({
            color: 0xffd700,
            visible: this.config.collision_boxes,
            transparent: true,
            opacity: 0.5,
        }));
        // @ts-ignore
        bonusMesh.position.x = position.x;
        // @ts-ignore
        bonusMesh.position.y = position.y;

        const bonusShape: CANNON.Box = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
        const bonusBody: CANNON.Body = new CANNON.Body({
            mass: 0,
            shape: bonusShape,
            position: new CANNON.Vec3(bonusMesh.position.x, bonusMesh.position.y, bonusMesh.position.z),
            collisionResponse: false,
        });

        this.world.addBody(bonusBody);
        this.scene.add(bonusMesh);

        bonus.position.set(bonusMesh.position.x, bonusMesh.position.y, bonusMesh.position.z);
        bonus.position.y -= 0.7
        this.scene.add(bonus);

        const object: MeshBodyModel = {mesh: bonusMesh, body: bonusBody, model: bonus};
        this.bonus.push(object);
    }

    addMeshBodyUFO(): void {
        const [position] = this.bountyEnemiesSpawnPosition();

        const ufoMesh: THREE.Mesh<THREE.CylinderGeometry> = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 1, 0.5, 4, 1), new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            visible: this.config.collision_boxes,
            transparent: true,
            opacity: 0.5,
        }));
        // @ts-ignore
        ufoMesh.position.x = position.x;
        // @ts-ignore
        ufoMesh.position.y = position.y;

        ufoMesh.castShadow = true;
        ufoMesh.receiveShadow = true;

        const ufoShape: CANNON.Cylinder = new CANNON.Cylinder(0.01, 1, 0.5, 4);
        const ufoBody: CANNON.Body = new CANNON.Body({
            mass: 0,
            shape: ufoShape,
            position: new CANNON.Vec3(ufoMesh.position.x, ufoMesh.position.y, ufoMesh.position.z),
        });

        this.world.addBody(ufoBody);
        this.scene.add(ufoMesh);

        const ufo = this.ufo.scene.clone();
        ufo.position.set(ufoMesh.position.x, ufoMesh.position.y, ufoMesh.position.z);
        this.scene.add(ufo);

        const object: MeshBodyModel = {mesh: ufoMesh, body: ufoBody, model: ufo};
        this.UFOsMeshBodies.push(object);
    }

    moveUFOs(): void {
        if (!this.UFOsMeshBodies || this.game_over || this.paused) return;
        for (const ufo of this.UFOsMeshBodies) {

            const velocity: number = this.getDifficultyConfig(this.config.difficulty.selected).velocity;

            ufo.mesh.position.x -= velocity;
            ufo.body.position.x -= velocity;
        }
    }

    moveBonus(): void {
        if (!this.bonus || this.game_over || this.paused) return;
        for (const bonus of this.bonus) {
            const velocity: number = this.getDifficultyConfig(this.config.difficulty.selected).velocity;
            bonus.mesh.position.x -= velocity;
            bonus.body.position.x -= velocity;
        }
    }

    checkCollision(body1: any, body2: any): boolean {
        const distance = body1.position.distanceTo(body2.position);
        return distance < 1;
    }

    after1SecondCameraBackToNormal(): void {
        const this1 = this;
        setTimeout((): void => {
            if (!this1.camera) return;

            this1.cameraRestore();
            this.shaker.shake(this.camera, new THREE.Vector3(0, 0, 0), 300);
        }, 150);
    }

    hitShake(obstacle: any = null): void {
        if (this.game_over || this.paused) return;

        this.after1SecondCameraBackToNormal();
        this.shaker.shake(this.camera, new THREE.Vector3(0.01, 0.1, 0), 300);
        this.player.play('hit').then((): void => {
        });

        if (obstacle) {
            const yAxis: number = Math.random() < 0.5 ? -0.1 : 0.1;
            //obstacle.body.position.y += yAxis; // only for testing

            if (this.birdBody) {
                this.birdBody.position.y += -Math.abs(yAxis);
            }
        }
    }

    ScreenShake(): ShakeObject {
        return {
            // When a function outside ScreenShake handle the camera, it should
            // always check that ScreenShake.enabled is false before.
            enabled: false,

            _timestampStart: undefined,

            _timestampEnd: undefined,

            _startPoint: undefined,

            _endPoint: undefined,

            position: 0,


            // update(camera) must be called in the loop function of the renderer,
            // it will re-position the camera according to the requested shaking.
            update: function update(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera): void {
                if (this.enabled) {
                    const now: number = Date.now();
                    if (this._timestampEnd && this._timestampEnd > now) {
                        let interval: number = (Date.now() - (this._timestampStart ?? 0)) /
                            (this._timestampEnd - (this._timestampStart ?? 0));
                        this.computePosition(camera, interval);
                    } else {
                        camera.position.copy(this._startPoint ?? new THREE.Vector3());
                        this.enabled = false;
                    }
                }
            },


            // This initialize the values of the shaking.
            // vecToAdd param is the offset of the camera position at the climax of its wave.
            shake: function shake(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, vecToAdd: THREE.Vector3Like, milliseconds: number): void {
                this.enabled = true;
                this._timestampStart = Date.now();
                this._timestampEnd = this._timestampStart + milliseconds;
                this._startPoint = new THREE.Vector3().copy(camera.position);
                this._endPoint = new THREE.Vector3().addVectors(camera.position, vecToAdd);
            },


            computePosition(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, interval: number): void {

                // This creates the wavy movement of the camera along the interval.
                // The first bloc call this.getQuadra() with a positive indice between
                // 0 and 1, then the second call it again with a negative indice between
                // 0 and -1, etc. Variable position will get the sign of the indice, and
                // get wavy.
                if (interval < 0.4) {
                    this.position = this.getQuadra(interval / 0.4);
                } else if (interval < 0.7) {
                    this.position = this.getQuadra((interval - 0.4) / 0.3) * -0.6;
                } else if (interval < 0.9) {
                    this.position = this.getQuadra((interval - 0.7) / 0.2) * 0.3;
                } else {
                    this.position = this.getQuadra((interval - 0.9) / 0.1) * -0.1;
                }

                if (this._startPoint && this._endPoint) {
                    // Here the camera is positioned according to the wavy 'position' variable.
                    camera.position.lerpVectors(this._startPoint, this._endPoint, this.position);
                }
            },

            // This is a quadratic function that return 0 at first, then return 0.5 when t=0.5,
            // then return 0 when t=1 ;
            getQuadra: function getQuadra(t: number): number {
                return 9.436896e-16 + (4 * t) - (4 * (t * t));
            }

        };
    };

    initGravity(): void {
        this.gravity = -Math.abs(this.getDifficultyConfig(this.config.difficulty.selected).gravity);
        this.world.gravity.set(0, this.gravity, 0);
    }

    calcElapsedTime(): void {
        if (this.timestamps.start && this.timestamps.end) {
            this.timestamps.elapsed_full = this.timestamps.end.diff(this.timestamps.start);
            this.timestamps.elapsed = this.timestamps.elapsed_full - this.timestamps.paused_time;
            return;
        }

        if (this.timestamps.start && !this.timestamps.end) {
            this.timestamps.elapsed_full = this.dayjs().diff(this.timestamps.start);
            this.timestamps.elapsed = this.timestamps.elapsed_full - this.timestamps.paused_time;
        }
    }

    getScore(): number {
        return this.score;
    }

    getElapsedTime(float: boolean = false): number {
        if (this.timestamps.elapsed === 0) return 0;

        if (float) {
            return this.timestamps.elapsed / 1000;
        }
        return Math.floor(this.timestamps.elapsed / 1000);
    }

    timeout(): boolean {
        if (this.config.limit_time === 0) return false;

        return this.timestamps.elapsed >= this.config.limit_time * 1000;
    }

    coinVictory(): boolean {
        if (this.config.limit_score === 0) return false;

        return this.score >= this.config.limit_score;
    }

    checkWin(): boolean {
        if (this.config.survival) return this.timeout() || this.coinVictory();

        return this.coinVictory();
    }

    statisticsEnd(): any {
        const config: any = {
            config: {
                ...this.getDifficultyConfig(this.config.difficulty.selected),
                selected: this.config.difficulty.selected
            },
            limit_score: this.config.limit_score,
            limit_time: this.config.limit_time,
            survival: this.config.survival,
        };

        return {
            score: this.score,
            highScore: this.high_score,
            duration: {
                seconds: this.getElapsedTime(),
                secondsFloat: this.getElapsedTime(true),
            },
            time: {
                startedAt: this.timestamps.start?.format('YYYY-MM-DD HH:mm:ss'),
                endedAt: this.timestamps.end?.format('YYYY-MM-DD HH:mm:ss'),
                pausedSeconds: this.timestamps.paused_time / 1000,
            },
            bonus: this.score_stats.bonus,
            hits: this.score_stats.hits,
            deadReason: (() => {
                if (this.checkWin()) return 'win';

                if (this.timeout()) return 'timeout';

                return 'outside';
            })(),
            difficulty: config,
        };
    }

    credits(): void {
        const loader: FontLoader = new FontLoader();
        const this1 = this;
        loader.load(this.assets.fonts, (font: any): void => {
            const scale: number = 0.002;
            const color: THREE.Color = new THREE.Color(this.config.credits.color);
            const matDark: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
                color: color,
                side: THREE.DoubleSide
            });

            const matLite: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
            });

            // @ts-ignore
            const height: number = this.config.internal.dimensions.y();

            const message: string = this.config.credits.message;
            const shapes = font.generateShapes(message, 100);
            const geometry: THREE.ShapeGeometry = new THREE.ShapeGeometry(shapes);
            geometry.scale(scale, scale, scale)
            geometry.computeBoundingBox();
            const xMid: number = -0.5 * ((geometry.boundingBox?.max?.x ?? 0) - (geometry.boundingBox?.min?.x ?? 0));
            geometry.translate(xMid, -height, 0);
            const text: THREE.Mesh<THREE.ShapeGeometry> = new THREE.Mesh(geometry, matLite);
            text.position.z = -150;
            this1.scene.add(text);
            this1.creditsText.text = text
            const holeShapes: any[] = [];

            for (let i = 0; i < shapes.length; i++) {
                const shape = shapes[i];
                if (shape.holes && shape.holes.length > 0) {
                    for (let j = 0; j < shape.holes.length; j++) {
                        const hole = shape.holes[j];
                        holeShapes.push(hole);
                    }
                }
            }

            shapes.push.apply(shapes, holeShapes);
            const style: any = SVGLoader.getStrokeStyle(5, color.getStyle());
            const strokeText: THREE.Group<THREE.Object3DEventMap> = new THREE.Group();

            for (let i = 0; i < shapes.length; i++) {
                const shape = shapes[i];
                const points = shape.getPoints();
                const geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes> = SVGLoader.pointsToStroke(points, style);
                geometry.scale(scale, scale, scale)
                geometry.translate(xMid, -height, 0);
                const strokeMesh: THREE.Mesh<THREE.BufferGeometry> = new THREE.Mesh(geometry, matDark);
                strokeText.add(strokeMesh);
            }

            //this1.scene.add(strokeText);
            this1.creditsText.stroke = strokeText
        });
    }

    isPlaying(): boolean {
        return this.playing;
    }

    isPaused(): boolean {
        return this.paused;
    }

    async loadBackgroundModel(): Promise<any> {
        let this1 = this;
        this.backgroundTexture = null;
        return new Promise((resolve, reject) => {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(this.assets.background, (bg) => {
                this1.backgroundTexture = bg;
                resolve(true);
            }, undefined, async (error) => {
                reject(error);
            });
        });
    }

    async initBackground(): Promise<void> {
        if (!this.backgroundTexture) return;
        this.backgroundScene = new THREE.Scene();
        this.backgroundCamera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2,
            window.innerHeight / 2, window.innerHeight / -2,
            -1, 10);
        this.backgroundScene.add(this.backgroundCamera);

        this.backgroundMaterial = new THREE.MeshBasicMaterial({map: this.backgroundTexture});
        this.planeGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
        this.background1 = new THREE.Mesh(this.planeGeometry, this.backgroundMaterial);
        this.background2 = new THREE.Mesh(this.planeGeometry, this.backgroundMaterial);

        this.background1.position.y = 0;
        this.background1.position.x = 0;
        this.background1.position.z = -10;
        this.background1.scale.set(1, 1, 1);

        this.background2.position.y = 0;
        this.background2.position.x = window.innerWidth;
        this.background2.position.z = -10;
        this.background2.scale.set(1, 1, 1);

        this.backgroundScene.add(this.background1);
        this.backgroundScene.add(this.background2);
    }

    infiniteScrollBackground(): void {
        if (!this.background1 || !this.background2 || this.paused || this.game_over) {
            return;
        }

        this.background1.position.x -= 2;
        this.background2.position.x -= 2;

        if (this.background1.position.x <= -window.innerWidth) {
            this.background1.position.x = window.innerWidth;
        }
        if (this.background2.position.x <= -window.innerWidth) {
            this.background2.position.x = window.innerWidth;
        }
    }

    backgroundResize(): void {
        if (!this.backgroundCamera) {
            return;
        }
        this.backgroundCamera.left = window.innerWidth / -2;
        this.backgroundCamera.right = window.innerWidth / 2;
        this.backgroundCamera.top = window.innerHeight / 2;
        this.backgroundCamera.bottom = window.innerHeight / -2;
        this.backgroundCamera.updateProjectionMatrix();
    }

    clearHighScore(): void {
        localStorage.removeItem(`${this.config.storage_prefix}_score`);
        this.high_score = 0;
    }
}



