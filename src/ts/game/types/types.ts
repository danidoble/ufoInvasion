import dayjs from "dayjs";
import * as THREE from "three";
import CANNON from "cannon-es";

export type lastPause = {
    start: dayjs.Dayjs | null,
    end: dayjs.Dayjs | null,
    elapsed: number
}

export type timestamps = {
    start: dayjs.Dayjs | null,
    end: dayjs.Dayjs | null,
    elapsed: number,
    elapsed_full: number,
    last_pause: lastPause,
    paused_time: number,
}

export type ShakeObject = {
    enabled: boolean;
    _timestampStart: undefined | number;
    _timestampEnd: undefined | number;
    _startPoint: undefined | THREE.Vector3 | THREE.Vector3Like;
    _endPoint: undefined | THREE.Vector3 | THREE.Vector3Like;
    update: any,
    shake: any,
    computePosition: any,
    getQuadra: any,
    position: number,
}

export type credits = {
    text: any,
    stroke: any,
};

export type MeshBodyModel = {
    mesh: THREE.Mesh,
    body: CANNON.Body,
    model: THREE.Mesh
}

export type scoreStats = {
    bonus: 0,
    hits: 0,
    time: 0,
}

export type assets = {
    background: string,
    bird: string,
    ufo: string,
    coin: string,
    fonts: string,
    winner: string[],
    loser: string[],
    tap: string,
}

export type sounds = {
    point: string,
    hit: string,
    flying: string,
    loser: string,
    high_difficulty: string,
    wannaCry_difficulty: string,
    winner: string,
}

export type difficulty = {
    min_enemy: number,
    max_enemy: number,
    velocity: number,
    gravity: number,
    min_bonus: number,
    max_bonus: number,
}

export type position = {
    x: number,
    y: number,
    z: number,
}

export type creditsConfig = {
    message: string,
    color: number,
}

export type config = {
    debug: boolean,
    collision_boxes: boolean,
    storage_prefix: string,
    winner_messages: number,
    loser_messages: number,
    exposure: {
        day: number,
        night: number,
        change_every_seconds: number,
        change: boolean,
    },
    camera: {
        zoom: number,
        fov: number,
        near: number,
        far: number,
        lookAt: position,
        position: position,
        rotation: position,
    },
    light: {
        ambient: {
            color: number,
            intensity: number
        },
        directional: {
            color: number,
            intensity: number,
            position: position,
        }
    },
    bird: {
        velocity: position,
        position: position,
        scale: position
    },
    ufo: {
        position: position,
        scale: position
    },
    coin: {
        scale: position
    },
    difficulty: {
        selected: string,
        easy: difficulty,
        medium: difficulty,
        hard: difficulty,
        extreme: difficulty,
        legend: difficulty,
        wannaCry: difficulty,
    },
    limit_time: number,
    limit_score: number,
    survival: boolean,
    credits: creditsConfig,
    internal: internalConfig
}

export type internalConfig = {
    dimensions: widthHeight,
    //groundMesh: widthHeight,
}

export type defaultConfiguration = {
    debug: boolean,
    collisionBoxes: boolean,
}

export type ErrorType = {
    bird: boolean,
    ufo: boolean,
    background: boolean,
    coin: boolean,
};

export type controls = {
    pause: string[],
    restart: string[],
    tap: string[]
}

export type widthHeight = {
    instance: any,
    width: object,
    height: object,
    x: object,
    y: object,
}