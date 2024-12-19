import { Application, Assets, Sprite, Texture } from "pixi.js";
import { Scene } from "./core/Scene";
import { Engine } from "matter-js";
import { Terrain } from "./core/Terrain";

(async () => {
    const app = new Application();
    await app.init({
        resizeTo: window,
        resolution: window.devicePixelRatio || 1
    });
    document.getElementById("pixi-container")!.appendChild(app.canvas);

    // Initialize matter-js 
    const engine = Engine.create();
    const world = engine.world;
    engine.gravity.x = 0;
    engine.gravity.y = 1;

    // Load the assets.
    await Assets.load([
        {
            alias: "background",
            src: "/assets/bg.png",
        },
        {
            alias: "tank",
            src: "/assets/pixel-tank.png"
        }
    ]);

    const scene = new Scene(app.screen.width, app.screen.height);
    scene.view.y = 0;

    const terrain = new Terrain(app.screen.width, app.screen.height, 10);
    terrain.createTerrain(app.renderer.generateTexture(terrain.pixelGraphics));

    const tankSprite = new Sprite(Texture.from('tank'));
    tankSprite.position.set(app.screen.width / 2, app.screen.height / 2);
    tankSprite.anchor.set(0.5);

    app.stage.addChild(scene.view, terrain.pixelContainer, tankSprite);

    app.ticker.add(() => {
        tankSprite.position.set(tankSprite.position.x, tankSprite.position.y + 1);
    })
})();
