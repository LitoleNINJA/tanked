import { Container, Graphics, Sprite, Texture } from "pixi.js";

export class Terrain {
    pixels: Array<number>;
    pixelContainer: Container;
    width: number;
    height: number;
    groundLevel: number;
    pixelSize: number;
    pixelGraphics: Graphics;

    constructor(
        width: number,
        height: number,
        pixelSize: number
    ) {
        this.width = Math.ceil(width / pixelSize);
        this.height = Math.ceil(height / pixelSize);
        this.pixels = new Array(this.width * this.height).fill(0);
        this.pixelContainer = new Container();
        this.groundLevel = Math.floor(this.height * 0.7);
        this.pixelSize = pixelSize;

        // Create pixel sprites
        this.pixelGraphics = new Graphics()
            .rect(0, 0, this.pixelSize, this.pixelSize)
            .fill(0x4a8c3b);

        this.generateTerrain();
    }

    generateTerrain() {
        console.log(this.width, this.height, this.groundLevel);
        for (let x = 0; x < this.width; x++) {
            for (let y = this.groundLevel; y < this.height; y++) {
                this.setPixel(x, y, 1);
            }
        }
    }

    setPixel(x: number, y: number, value: number) {
        this.pixels[x + y * this.width] = value;
    }

    getPixel(x: number, y: number) {
        return this.pixels[x + y * this.width];
    }

    createTerrain(pixelTexture: Texture) {
        // Clear existing sprites
        while (this.pixelContainer.children.length > 0) {
            this.pixelContainer.removeChildAt(0);
        }

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.getPixel(x, y)) {
                    const sprite = new Sprite(pixelTexture);
                    sprite.x = x * this.pixelSize;
                    sprite.y = y * this.pixelSize;
                    this.pixelContainer.addChild(sprite);
                }
            }
        }
    }
}
