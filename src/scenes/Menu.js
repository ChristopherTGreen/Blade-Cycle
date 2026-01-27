class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }

    preload() {
        
        
        this.scene.start('highwayScene')
    }

    update() {
        
    }
}