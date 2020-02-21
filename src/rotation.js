import { BaseScript } from 'mage-engine';

export default class Rotation extends BaseScript {

    constructor() {
        super('rotation');
    }

    start(mesh) {
				// mesh is the element this script is attached to
				this.mesh = mesh;
        this.angle = 0;
    }

    update(dt) {
        this.angle += 0.01;
        this.mesh.rotation({ y: this.angle });
    }
}
