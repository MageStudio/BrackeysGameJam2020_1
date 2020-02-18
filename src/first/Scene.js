import {
    App,
    ControlsManager,
    SceneManager,
    AmbientLight,
    ModelsEngine,
    ScriptManager,
    ImagesEngine
} from 'mage-engine';

import CarScript from '../carScript';

const GRID_SIZE = 1000;
const GRID_STEP = 100;

export default class FlatGrid extends App {

    addAmbientLight() {
        const light = new AmbientLight({
            color: 0xeeeeee,
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

        const plane = ModelsEngine.getModel('plane_1');
        const car = ModelsEngine.getModel('car');

        plane.position({ y: -45 });
        plane.setTexture('prototype', { repeat: { x: 10, y: 10 } });

        car.addScript('carScript');
        car.setWireframe(true);

        window.car = car;

        // this.sceneHelper.addGrid(GRID_SIZE, GRID_STEP);
    }
}
