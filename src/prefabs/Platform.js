class Platform extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing
        this.setSize(this.width, this.height)
        
    }

    create() {
        
    }

    update() {

        
    }
}