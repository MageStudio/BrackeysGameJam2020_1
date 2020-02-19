import { BaseScript, Input, SceneManager } from 'mage-engine';

export default class CarScript extends BaseScript {

    constructor() {
        super('car');
    }

    start(mesh) {
        Input.enable();
        Input.addEventListener('keyDown', this.onKeyDown.bind(this));
        Input.addEventListener('keyUp', this.onKeyUp.bind(this));

        SceneManager.camera.position({y: 120, z: 250});
        SceneManager.camera.lookAt(0, 0, 0);

        this.TIME_FRACTION = 0.005;

        this.mesh = mesh;

        this.position = mesh.position();

        this.FW_ACC = 100;
        this.BW_ACC = 100;
        this.ANG_SPEED = 2.5;

        this.maxSpeed = 275;
        this.maxReverseSpeed = -275;

        this.forward = false;
        this.backwards = false;

        this.speed = 0;
        this.speed_y = 0;
        this.orientation = 0;
    }


    onKeyDown(e) {
        if (Input.keyboard.isPressed('w')) {
            this.forward = true;
        }
        if (Input.keyboard.isPressed('s')) {
            this.backwards = true;
        }
        if (Input.keyboard.isPressed('d')) {
            this.right = true;
        }
        if (Input.keyboard.isPressed('a')) {
            this.left = true;
        }
    }

    onKeyUp(e) {
        switch (e.event.key) {
            case 'w':
                this.forward = false;
            case 's':
                this.backwards = false;
            case 'a':
                this.left = false;
            case 'd':
                this.right = false;
        }
    }

    exponentialEaseOut(k) { return k === 1 ? 1 : - Math.pow(2, - 10 * k) + 1; }
    clamp(value, min, max) { return Math.min(Math.max(value, min), max); }

    updatePosition(dt) {

        if (this.forward) {
            this.speed = this.clamp(this.speed + dt * this.FW_ACC, this.maxReverseSpeed, this.maxSpeed);
        }

        if (this.backwards) {
            this.speed = this.clamp(this.speed - dt * this.BW_ACC, this.maxReverseSpeed, this.maxSpeed);
        }

        var dir = 1;

        if (this.left) {
            this.orientation += dt * this.ANG_SPEED;
            this.speed = this.clamp(this.speed + dir * dt * this.FW_ACC, this.maxReverseSpeed, this.maxSpeed);
        }

        if (this.right) {
            this.orientation -= dt * this.ANG_SPEED;
            this.speed = this.clamp(this.speed + dir * dt * this.FW_ACC, this.maxReverseSpeed, this.maxSpeed);
        }

        if (!(this.forward || this.backwards)) {

            if (this.speed > 0) {
                const k = this.exponentialEaseOut(this.speed / this.maxSpeed);
                this.speed = this.clamp(this.speed - k * dt * this.FW_ACC, 0, this.maxSpeed);
            } else {
                const k = this.exponentialEaseOut(this.speed / this.maxReverseSpeed);
                this.speed = this.clamp(this.speed + k * dt * this.BW_ACC, this.maxReverseSpeed, 0);
            }
        }

        // always updating y
        this.speed_y -= 9.8 * 100.0 * dt;
        if (this.mesh.isOnObject()) {
			this.speed_y = Math.max(0, this.speed_y);
		}

        const forwardDelta = this.speed * dt;

        const { x, y, z } = this.mesh.position();

        this.mesh.position({
            x: x + Math.sin( this.orientation ) * forwardDelta,
            z: z + Math.cos( this.orientation ) * forwardDelta,
            y: y + this.speed_y * dt
        })

        this.mesh.rotation({
            y: this.orientation
        });
    }

    update(dt) {
        this.updatePosition(dt);
    }
}
