import { Router } from 'mage-engine';
import Scene from './first/Scene';

const assets = {
    Audio: {
        'engine': 'assets/audio/engine.mp3'
    },

    Video: {},

    Images: {},

    Scripts: {},

    Textures: {
        'prototype': 'assets/textures/prototype.png',
        'level1': 'assets/textures/level_1.test.png',
        'smoke': 'assets/textures/smoke_particle.png'
    },

    Models: {
        'level_1': 'assets/models/plane.level.1.glb',
        'car': 'assets/models/car.glb'
    },

    General: {}
};

const config = {

    screen: {
        h : window ? window.innerHeight : 800,
        w : window ? window.innerWidth : 600,
        ratio : window ? (window.innerWidth/window.innerHeight) : (600/800),
        frameRate : 60,
        alpha: true
    },

    lights: {
        shadows: true
    },

    physics: {
        enabled: false
    },

    tween: {
        enabled: false
    },

    camera : {
        fov : 75,
        near : 0.1,
        far : 3000000
    }
};

window.addEventListener('load', function() {
    Router.on('/', Scene);
    Router.start(config, assets, '#gameContainer');
});
