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
    Vector3,
    THREEColor
} from 'mage-engine';

import UIContainer from '../ui/UIContainer';

import CarScript from '../carScript';
import Rotation from '../rotation';

export default class FlatGrid extends App {

    addAmbientLight() {
        new AmbientLight({
            color: 0xffffff,
            intensity: 0.1,
            name: 'ambientlight'
        });
    }

    addSunlight() {
        new SunLight({
            color: 0xf9ecec,
            intensity: 0.3,
            position: { x: 10, y: 10, z: 10 },
            target: { x: 0, y: 0, z: 5 },
            name: 'sunlight'
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
        SceneManager.camera.position({y: 8, z: 10});
        SceneManager.camera.lookAt(0, 0, 0);
    };

    setUpCar = () => {
        this.car = ModelsEngine.getModel('car');
        this.car.addScript('carScript');
        this.car.setColor(0xa8e6cf);
        this.car.addSound('engine', { loop: true, autoplay: true });
        this.car.sound.setVolume(2);
        //this.car.setMaterialFromName('lambert');
        //this.car.setTextureMap('car');
        // this.car.scale({x : 0.5, y: 0.5, z: 0.5 });

        this.setUpSmokeEffect();
    }

    setUpPlane = () => {
        const plane = ModelsEngine.getModel('plane');
        //plane.position({ y: -45 });
        //plane.rotation({ x: Math.PI });
        plane.setColor(0xbbded6);
        //plane.setColor(0xecf2f9);
        //plane.setTextureMap('level1', { repeat: { x: 1, y: 1 } });

        window.plane = plane;
    };

    setUpTargets = () => {
        const targetBlue = ModelsEngine.getModel('target.blue');
        const targetRed = ModelsEngine.getModel('target.red');

        targetBlue.setColor(0xa8e6cf); // c8d9eb
        targetRed.setColor(0xffaaa5);

        const targetBlueGoal = ModelsEngine.getModel('target.blue.goal');
        const targetRedGoal = ModelsEngine.getModel('target.red.goal');

        targetBlueGoal.setColor(0xa8e6cf);// c8d9eb
        targetBlueGoal.setOpacity(0.1);
        targetRedGoal.setColor(0xffaaa5);
        targetRedGoal.setOpacity(0.1);
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
        this.setUpPlane();
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

        this.enableUI(UIContainer, {
            onOverlayButtonClick: this.setUp
        });

        ScriptManager.create('carScript', CarScript);
        ScriptManager.create('rotation', Rotation);
    }
}
