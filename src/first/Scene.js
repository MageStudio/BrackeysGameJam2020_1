import {
    App,
    ControlsManager,
    SceneManager,
    AmbientLight,
    ModelsEngine,
    ScriptManager,
    ParticleEngine,
    ImagesEngine
} from 'mage-engine';

import CarScript from '../carScript';
import Rotation from '../rotation';

export default class FlatGrid extends App {

    addAmbientLight() {
        const light = new AmbientLight({
            color: 0xffffff,
            intensity: 1,
            target: { x: 0, y: 0, z: 0 },
            name: 'sunlight'
        });

        light.position({ y: 300, z: -700 });

        return light;
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
        SceneManager.camera.position({y: 300, z: 700});
        SceneManager.camera.lookAt(0, 0, 0);
    };

    onCreate() {
        ControlsManager.setOrbitControl();
        SceneManager.setClearColor(0xa8e6cf);

        this.addAmbientLight();
        this.setUpCamera();

        ScriptManager.create('carScript', CarScript);
        ScriptManager.create('rotation', Rotation);

        const plane = ModelsEngine.getModel('plane_2');
        const car = ModelsEngine.getModel('car');

        plane.position({ y: -45 });
        plane.setTextureMap('prototype', { repeat: { x: 10, y: 10 } });

        plane.add(car);

        car.scale({x : 0.5, y: 0.5, z: 0.5 });
        car.addScript('carScript');
        car.setWireframe(true);

        plane.addScript('rotation');

        window.plane = plane;

        const Fountain = ParticleEngine.get('Fountain');

        ParticleEngine.addParticleEmitter(new Fountain({ container: car.mesh }));

        // this.sceneHelper.addGrid(GRID_SIZE, GRID_STEP);
    }
}
