class Player extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing
        this.setSize(this.width, this.height/2).setOffset(0, this.height/2)
        // speed variable
        this.PLAYER_VELOCITY = 200 // technically acceleration
        this.PLAYER_MAX_VELOCITY = 300
        this.PLAYER_DRAGX = 200

        // set drag
        this.setDragX(this.PLAYER_DRAGX)
    }

    create() {
        
    }

    update() {
        // reset velocity
        // player velocity
        let playerVector = new Phaser.Math.Vector2(0, 0)
        
        
        if(keyLEFT.isDown) {
            playerVector.x = -1
        } else if(keyRIGHT.isDown) {
            playerVector.x = 1
        }

        if(keySPACE.isDown && this.body.onFloor()) {
            this.body.setVelocityY(-500)
        }

        this.setAccelerationX(this.PLAYER_VELOCITY * playerVector.x)
        
        
    }

    seated() {
        this.setAccelerationX(0)
        this.setVelocity(0, 0)
    }
}