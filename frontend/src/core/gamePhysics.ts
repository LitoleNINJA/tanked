import { Bodies, Body, Composite, Engine, World } from "matter-js";
import { PHYSICS_CONFIG } from "./physicsConfig";

export class gamePhysics {
    engine: Engine;
    world: World;
    bodies: {
        terrain: Array<Body>;
        tank: Body | null;
    };
    pixelSize: number;

    constructor() {
        // Initialize matter-js
        this.engine = Engine.create();
        this.world = this.engine.world;
        this.engine.gravity.x = PHYSICS_CONFIG.world.gravityX;
        this.engine.gravity.y = PHYSICS_CONFIG.world.gravityY;
        this.pixelSize = PHYSICS_CONFIG.terrain.pixelSize;

        this.bodies = {
            terrain: new Array<Body>(),
            tank: null,
        };
    }

    createTank(x: number, y: number) {
        this.bodies.tank = Bodies.rectangle(
            x,
            y,
            PHYSICS_CONFIG.tank.width,
            PHYSICS_CONFIG.tank.height,
            {
                density: PHYSICS_CONFIG.tank.density,
                friction: PHYSICS_CONFIG.tank.friction,
            }
        );

        Composite.add(this.world, [this.bodies.tank]);
    }

    createTerrian(width: number, height: number, groundLevel: number) {
        const terrainWidth = Math.ceil(width / this.pixelSize);
        const terrainHeight = Math.ceil(height / this.pixelSize);
        groundLevel = Math.floor(terrainHeight * groundLevel);

        // console.log(width, height, terrainWidth, terrainHeight, groundLevel, this.pixelSize);
        for (let x = 0; x < terrainWidth; x++) {
            for (let y = groundLevel; y < terrainHeight; y++) {
                const body = Bodies.rectangle(
                    x * this.pixelSize,
                    y * this.pixelSize,
                    this.pixelSize,
                    this.pixelSize,
                    {
                        isStatic: true,
                    }
                );
                this.bodies.terrain.push(body);
            }
        }

        // console.log(this.bodies.terrain.slice(0, 10))
        Composite.add(this.world, this.bodies.terrain);
    }

    update(delta = 1000 / 60) {
        Engine.update(this.engine, delta);
    }

    getTankState() {
        if (!this.bodies.tank) return null;

        return {
            tank: {
                position: this.bodies.tank.position,
                angle: this.bodies.tank.angle,
            },
        };
    }

    // Movement controls
    applyTankForce(direction: number, magnitude: number) {
        if (this.bodies.tank) {
            Body.applyForce(
                this.bodies.tank,
                this.bodies.tank.position,
                { x: direction * magnitude, y: 0 }
            );
        }
    }

    getTerrainState() {
        if (!this.bodies.terrain) return null;

        return {
            terrain: this.bodies.terrain,
            pixelSize: this.pixelSize,
        };
    }

    destroy() {
        World.clear(this.world, false);
        Engine.clear(this.engine);
    }
}
