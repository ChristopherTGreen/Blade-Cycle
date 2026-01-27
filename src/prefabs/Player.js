class Player extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing

        // temporary
        this.PLAYER_VELOCITY = 500
    }

    create() {
        
    }

    update() {
        // reset velocity
        // player velocity
        let playerVector = new Phaser.Math.Vector2(0, 0)
        let playerDirection = 'down' // temporary
        
        if(keyLEFT.isDown) {
            playerVector.x = -1
            playerDirection = 'left'
        } else if(keyRIGHT.isDown) {
            playerVector.x = 1
            playerDirection = 'right'
        }

        if(keyUP.isDown) {
            playerVector.y = -1
            playerDirection = 'up'
        } else if(keyDOWN.isDown) {
            playerVector.y = 1
            playerDirection = 'down'
        }

        playerVector.normalize()

        this.setVelocity(this.PLAYER_VELOCITY * playerVector.x, this.PLAYER_VELOCITY * playerVector.y)
        
    }
}