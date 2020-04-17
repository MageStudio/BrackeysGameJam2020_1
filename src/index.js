import { Router, store } from 'mage-engine';
import Scene from './first/Scene';
import reducers from './ui/reducers';

store.createStore(reducers, {}, true);

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
        'car': 'assets/textures/car.png',
        'smoke': 'assets/textures/smoke_particle.png',
        'circle': 'assets/textures/circle.texture.png'
    },

    Models: {
        'plane': 'assets/models/plane.glb',
        'target.blue': 'assets/models/target.blue.gltf',
        'target.red': 'assets/models/target.red.gltf',
        'target.red.goal': 'assets/models/target.red.goal.glb',
        'target.blue.goal': 'assets/models/target.blue.goal.glb',
        'buggy.blue': 'assets/models/buggy.gltf',

        'wheel.rear.left': 'assets/models/wheel.rear.left.gltf',
        'wheel.rear.right': 'assets/models/wheel.rear.right.gltf',
        'wheel.front.left': 'assets/models/wheel.front.left.gltf',
        'wheel.front.right': 'assets/models/wheel.front.right.gltf',

        'pc.case': 'assets/models/pc.case.gltf',
        'pc.keyboard': 'assets/models/pc.keyboard.gltf',
        'pc.monitor': 'assets/models/pc.monitor.gltf',


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
        enabled: true,
        path: 'http://localhost:8085/js/mage.physics.js'
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
