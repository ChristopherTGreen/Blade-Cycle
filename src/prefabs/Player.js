class Player extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing
        this.setSize(this.width/4, this.height/2).setOffset(this.width/2-8, this.height/4)
        // properties
        this.PLAYER_VELOCITY = 300 // technically acceleration
        this.PLAYER_MAX_VELOCITY = 300
        this.PLAYER_DRAGX = 200
        this.hp = 100

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
            this.body.setVelocityY(-300)
        }

        this.setAccelerationX(this.PLAYER_VELOCITY * playerVector.x)
        
        
    }

    seated() {
        this.setAccelerationX(0)
        this.setVelocity(0, 0)
    }
}