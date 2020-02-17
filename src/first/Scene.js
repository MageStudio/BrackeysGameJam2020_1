import {
    App,
    ControlsManager,
    SceneManager,
    SunLight,
    ModelsEngine
} from 'mage-engine';

const GRID_SIZE = 1000;
const GRID_STEP = 100;

export default class FlatGrid extends App {

    addAmbientLight() {
        const light = new SunLight({
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
        SceneManager.setClearColor(0x222222);

        this.addAmbientLight();
        this.setUpCamera();

        ModelsEngine.getModel('plane_1');

        this.sceneHelper.addGrid(GRID_SIZE, GRID_STEP);
    }
}
