import { RepeatWrapping, Texture, TextureLoader } from 'three'

export class AssetsController {
    private static textureLoader = new TextureLoader()

    public static grassTexture: Texture

    public static async init() {
        this.grassTexture = await this.textureLoader.loadAsync('assets/grass2-border.jpeg')
    }
}
