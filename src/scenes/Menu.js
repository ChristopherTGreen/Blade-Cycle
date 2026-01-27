class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }

    preload() {
        this.load.image('character', './assets/nonstatic/CharacterBox.png')
    }

    create() {
        
        this.scene.start('highwayScene')
    }

    update() {
        
    }
}