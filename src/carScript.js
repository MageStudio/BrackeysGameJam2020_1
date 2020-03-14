import { BaseScript, Input, constants, SceneManager } from 'mage-engine';

const { VECTOR_DOWN, DOWN } = constants;

export default class CarScript extends BaseScript {

    constructor() {
        super('car');
    }

    start(mesh) {
        Input.enable();

        this.mesh = mesh;
        this.mesh.setRayColliders([VECTOR_DOWN], { far: 2, near: 0 });

        this.wheels = {
            right: this.mesh.getChildByName('wheel.front.right'),
            left: this.mesh.getChildByName('wheel.front.left'),
        };

        this.FW_ACC = 3;
        this.BW_ACC = 3;
        this.ANG_SPEED = 2.5;

        this.mass = 1;
        this.gravity = 9.8;

        this.maxSpeed = 10;
        this.maxReverseSpeed = -this.maxSpeed;

        this.forward = false;
        this.backwards = false;
        this.left = false;
        this.right = false;

        this.speed = 0;
        this.speed_y = 0;
        this.orientation = 0;
    }

    percentage(value, max) {
        return Math.abs(value) * 100 / max;
    }
    exponentialEaseOut(k) { return k === 1 ? 10 : - Math.pow(2, - 2 * k) + 5; }
    clamp(value, min, max) { return Math.min(Math.max(value, min), max); }

    getDetuneFromSpeed = () => {
        const max = 1200;
        const min = -1200;

        return (Math.abs(this.speed) * (max * 2) / this.maxSpeed) + min;
    }

    updateSound() {
        if (this.mesh.sound) {
            this.mesh.sound.detune(this.getDetuneFromSpeed());
        }
    }

    updateInput() {
        this.forward = Input.keyboard.isPressed('w');
        this.backwards = Input.keyboard.isPressed('s');
        this.right = Input.keyboard.isPressed('d');
        this.left = Input.keyboard.isPressed('a');
    }

    updateYSpeed(dt) {
        this.speed_y -= this.gravity * this.mass * dt;
        const { meshes } = this.mesh.isCollidingOnDirection(DOWN);
        if (meshes.length > 0) {
            this.speed_y = Math.max(0, this.speed_y);
        }
    }

    updatePosition(dt) {

        if (this.forward) {
            this.speed = this.clamp(this.speed + dt * this.FW_ACC, this.maxReverseSpeed, this.maxSpeed);
        }

        if (this.backwards) {
            if (this.speed > 0) {
                // going forward, we're breaking
                this.speed = this.clamp(this.speed - dt * this.BW_ACC * 4, this.maxReverseSpeed, this.maxSpeed);
            } else {
                this.speed = this.clamp(this.speed - dt * this.BW_ACC, this.maxReverseSpeed, this.maxSpeed);
            }
        }

        var dir = 1;

        if (this.left && this.speed !== 0) {
            this.orientation += dt * this.ANG_SPEED;
            this.speed = this.clamp(this.speed + dir * dt * this.FW_ACC, this.maxReverseSpeed, this.maxSpeed);
        }

        if (this.right && this.speed !== 0) {
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
        this.updateYSpeed(dt);

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

        this.wheels.right.rotation({ y: this.rotation });
        this.wheels.left.rotation({ y: this.rotation });
    }

    updateCamera() {
        const { x, y, z } = this.mesh.position();
        SceneManager.camera.lookAt(x, y, z);
    }

    update(dt) {
        this.updateInput();
        this.updatePosition(dt);
        this.updateSound();
        this.updateCamera();
    }
}
