import { Application, Assets, Container, Graphics, Sprite } from "pixi.js";
import { Scene } from "./core/Scene";
import { gamePhysics } from "./core/gamePhysics";
import { PHYSICS_CONFIG } from "./core/physicsConfig";

(async () => {
    const app = new Application();
    await app.init({
        resizeTo: window,
        resolution: window.devicePixelRatio || 1
    });
    document.getElementById("pixi-container")!.appendChild(app.canvas);

    // Load the assets.
    await Assets.load([
        {
            alias: "background",
            src: "/assets/bg.png",
        },
        {
            alias: "tank",
            src: "/assets/pixel-tank.png",
        },
    ]);

    const physics = new gamePhysics();
    physics.createTank(app.screen.width / 2, app.screen.height / 2);
    physics.createTerrian(app.screen.width, app.screen.height, PHYSICS_CONFIG.terrain.groundLevel);

    const scene = new Scene(app.screen.width, app.screen.height);
    scene.view.y = 0;

    // make terrain
    const pixelContainer = new Container();
    const pixelGraphics = new Graphics()
        .rect(0, 0, PHYSICS_CONFIG.terrain.pixelSize+0.1, PHYSICS_CONFIG.terrain.pixelSize+0.1)
        .stroke('black')
        .fill(PHYSICS_CONFIG.colors.green);
    const pixelTexture = app.renderer.generateTexture(pixelGraphics);
    const terrainState = physics.getTerrainState();
    if (terrainState?.terrain) {
        const sprites = terrainState.terrain.map(body => {
            const sprite = new Sprite(pixelTexture);
            sprite.position.set(body.position.x - PHYSICS_CONFIG.terrain.pixelSize/2, body.position.y - PHYSICS_CONFIG.terrain.pixelSize/2);
            return sprite;
        });
        pixelContainer.addChild(...sprites);
    }

    // make tank
    // const tankSprite = new Sprite(Texture.from('tank'));
    const tankGraphics = new Graphics()
        .rect(app.screen.width / 2, app.screen.height / 2, PHYSICS_CONFIG.tank.width, PHYSICS_CONFIG.tank.height)
        .fill("red");
    const tankSprite = new Sprite(app.renderer.generateTexture(tankGraphics));
    // tankSprite.position.set(app.screen.width / 2, app.screen.height / 2);
    tankSprite.anchor.set(0.5);

    app.stage.addChild(scene.view, pixelContainer, tankSprite);

    app.ticker.add(() => {
        physics.update();

        const state = physics.getTankState();
        if (state) {
            tankSprite.position.copyFrom(state.tank.position);
            tankSprite.rotation = state.tank.angle;
        }
    });
})();
