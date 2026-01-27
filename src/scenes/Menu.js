class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }

    preload() {
        this.physics.add.sprite('character', 'assets/nonstatic/CharacterBox.png')
    }

    create() {

    }

    update() {
        this.scene.start('highwayScene')
    }
}