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

import MainMenu from '../ui/MainMenu';

import CarScript from '../carScript';
import Rotation from '../rotation';

const BACKGROUND_COLOR = 0x81ecec;//0x55efc4;//0xa8e6cf;
const PLANE_COLOR = 0xfab1a0;
const CAR_COLOR = 0xa8e6cf;
const SUN_COLOR = 0xe17055;//0x555555;
const AMBIENT_LIGHT_COLOR = 0xffffff;

export default class FlatGrid extends App {

    addAmbientLight() {
        window.ambient = new AmbientLight({
            color: BACKGROUND_COLOR,
            intensity: 0.1,
            name: 'ambientlight'
        });
    }

    addSunlight() {
        window.sun = new SunLight({
            color: SUN_COLOR,
            intensity: 2,
            position: { x: 20, y: 8, z: 0 },
            target: { x: 0, y: 0, z: 0 },
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
        SceneManager.camera.position({ y: 10, z: 16 });
        SceneManager.camera.lookAt(0, 0, 0);
    };

    setUpCar = () => {
        this.car = ModelsEngine.getModel('buggy.blue');
        window.car = this.car;
        this.car.setColor(CAR_COLOR);
        this.car.addSound('engine', { loop: true, autoplay: false });
        this.car.sound.setVolume(2);
        this.car.sound.start();
        this.car.setMaterialFromName('lambert');
        this.car.scale({ x : 0.5, y: 0.5, z: 0.5 });
        this.car.position({ y: .3 });

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
        plane.setColor(PLANE_COLOR);
    };

    setUpGround = () => {
        const ground = this.sceneHelper.addCube(1, BACKGROUND_COLOR);
        ground.setMaterialFromName('lambert');
        ground.position({y: -4});
        ground.scale({x: 500, z: 200, y: 0.5});
        ground.setColor(0x74b9ff);

        window.ground = ground;
    }

    setUpBack = () => {
        const back = this.sceneHelper.addCube(1, BACKGROUND_COLOR);
        back.setMaterialFromName('lambert');
        back.position({ z: 200 });
        back.scale({x: 500, y: 200});
        back.setColor(BACKGROUND_COLOR);

        window.back = back;
    }

    setUpTargets = () => {
        const targetBlue = ModelsEngine.getModel('target.blue');
        const targetRed = ModelsEngine.getModel('target.red');

        targetBlue.setColor(0xa8e6cf); // c8d9eb
        targetRed.setColor(0xffaaa5);

        targetBlue.setMaterialFromName('lambert');
        targetRed.setMaterialFromName('lambert');

        // const targetBlueGoal = ModelsEngine.getModel('target.blue.goal');
        // const targetRedGoal = ModelsEngine.getModel('target.red.goal');

        // targetBlueGoal.setColor(0xa8e6cf);// c8d9eb
        // targetBlueGoal.setOpacity(0.1);
        // targetRedGoal.setColor(0xffaaa5);
        // targetRedGoal.setOpacity(0.1);
    }

    setUpEnv = () => {
        const pc = {
            case: ModelsEngine.getModel('pc.case'),
            keyboard: ModelsEngine.getModel('pc.keyboard'),
            monitor: ModelsEngine.getModel('pc.monitor')
        };

        pc.case.setMaterialFromName('lambert');
        pc.keyboard.setMaterialFromName('lambert');
        pc.monitor.setMaterialFromName('lambert');
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

    onCreate() {
        ControlsManager.setOrbitControl();
        SceneManager.setShadowType('basic');
        SceneManager.setClearColor(BACKGROUND_COLOR);
        AudioEngine.setVolume(2);

        this.addAmbientLight();
        this.addSunlight();
        this.setUpCamera();
        this.setUpPlane();
        this.setUpGround();
        //this.setUpBack();
        this.setUpEnv();
        this.setUpTargets();

        this.enableUI(MainMenu, {
            onStartButtonClick: this.setUpCar
        });

        ScriptManager.create('carScript', CarScript);
        ScriptManager.create('rotation', Rotation);

        const hueSaturationEffect = PostProcessingEngine.get('HueSaturationEffect');

        PostProcessingEngine.add(hueSaturationEffect, { hue: 0.1, saturation: 0.3 });
    }
}
