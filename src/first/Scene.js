import {
    App,
    ControlsManager,
    SceneManager,
    AmbientLight,
    SunLight,
    ModelsEngine,
    AudioEngine,
    ScriptManager,
    ParticleEngine,
    Partykals,
    ImagesEngine,
    PostProcessingEngine,
    Vector3,
    THREEColor
} from 'mage-engine';

import UIContainer from '../ui/UIContainer';

import CarScript from '../carScript';
import Rotation from '../rotation';

export default class FlatGrid extends App {

    addAmbientLight() {
        window.ambient = new AmbientLight({
            color: 0xffffff,
            intensity: 0.1,
            name: 'ambientlight'
        });
    }

    addSunlight() {
        window.sun = new SunLight({
            color: 0x555555,//0xf9ecec,
            intensity: 3,
            position: { x: 10, y: 4, z: 2 },
            target: { x: 0, y: 0, z: 5 },
            name: 'sunlight',
            near: 0.1,
            far: 50
        });
    }

    progressAnimation = (callback) => {
        const loader = document.querySelector('.loader');
        loader.classList.remove('fadeout', 'invisible');
        setTimeout(() => {
            loader.classList.add('fadeout');
        }, 5000);
        setTimeout(() => {
            loader.classList.add('invisible');
        }, 6000);
        callback();
    };

    setUpCamera = () => {
        window.camera = SceneManager.camera;
        SceneManager.camera.position({y: 10, z: 22});
        SceneManager.camera.lookAt(0, 0, 0);
    };

    setUpCar = () => {
        this.car = ModelsEngine.getModel('buggy.blue');
        window.car = this.car;
        this.car.setColor(0xa8e6cf);
        this.car.addSound('engine', { loop: true, autoplay: false });
        this.car.sound.setVolume(2);
        this.car.sound.start();
        this.car.setMaterialFromName('lambert');
        this.car.scale({x : 0.5, y: 0.5, z: 0.5 });
        this.car.position({y: .3});

        const wheels = [
            ModelsEngine.getModel('wheel.front.left'),
            ModelsEngine.getModel('wheel.front.right'),
            ModelsEngine.getModel('wheel.rear.left'),
            ModelsEngine.getModel('wheel.rear.right')
        ];

        wheels.forEach(wheel => this.car.add(wheel));

        this.car.addScript('carScript');

        // this.setUpSmokeEffect();
    }

    setUpPlane = () => {
        const plane = ModelsEngine.getModel('plane');
        plane.setMaterialFromName('lambert');
        //plane.position({ y: -45 });
        //plane.rotation({ x: Math.PI });

        plane.setColor(0xfab1a0);
        //plane.setColor(0xc8d9eb); YES
        // plane.setColor(0xf1f2f6);


        //plane.setColor(0xbbded6);
        //plane.setColor(0xecf2f9);
        //plane.setTextureMap('level1', { repeat: { x: 1, y: 1 } });

        window.plane = plane;
    };

    setUpTargets = () => {
        const targetBlue = ModelsEngine.getModel('target.blue');
        const targetRed = ModelsEngine.getModel('target.red');

        targetBlue.setColor(0xa8e6cf); // c8d9eb
        targetRed.setColor(0xffaaa5);

        // const targetBlueGoal = ModelsEngine.getModel('target.blue.goal');
        // const targetRedGoal = ModelsEngine.getModel('target.red.goal');

        // targetBlueGoal.setColor(0xa8e6cf);// c8d9eb
        // targetBlueGoal.setOpacity(0.1);
        // targetRedGoal.setColor(0xffaaa5);
        // targetRedGoal.setOpacity(0.1);
    }

    setUpSmokeEffect = () => {
        const Fountain = ParticleEngine.get('Fountain');

        const fountainOptions = {
            container: this.car.mesh,
            particles: {
                ttl: 3,
                gravity: 2,
                startAlpha: 1,
                endAlpha: 0,
                particlesCount: 100,
                startAlphaChangeAt: 0,
                globalSize: 1,
                startColor: new THREEColor('grey'),
                endColor: new THREEColor('white'),
                blending: "blend",
                acceleration: new Partykals.Randomizers.SphereRandomizer(12.5),
                velocity: new Vector3(0, 0, -20),
                velocityBonus: new Vector3(0, 10, -20),
                texture: ImagesEngine.get('smoke')
            }
        };

        ParticleEngine.addParticleEmitter(new Fountain(fountainOptions));
    };

    setUp = () => {
        this.setUpTargets();
        this.setUpCar();
    };

    onCreate() {
        //ControlsManager.setOrbitControl();
        SceneManager.setClearColor(0xa8e6cf);
        AudioEngine.setVolume(2);

        this.addAmbientLight();
        this.addSunlight();
        this.setUpCamera();
        this.setUpPlane();

        this.enableUI(UIContainer, {
            onOverlayButtonClick: this.setUp
        });

        ScriptManager.create('carScript', CarScript);
        ScriptManager.create('rotation', Rotation);

        const hueSaturationEffect = PostProcessingEngine.get('HueSaturationEffect');

        PostProcessingEngine.add(hueSaturationEffect, { hue: 0.1, saturation: 0.6 });
    }
}
