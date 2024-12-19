import { Container, Sprite, Texture } from "pixi.js";

export class Scene {
    view: Container;
    background: Sprite;

    constructor(width: number, height: number) {
        this.view = new Container();

        // background
        const bgTexture = Texture.from("background");
        this.background = new Sprite(bgTexture);
        this.background.position.set(0, 0);
        this.background.width = width;
        this.background.height = height;

        this.view.addChild(this.background);
    }
}
