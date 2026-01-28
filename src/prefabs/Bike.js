class Bike extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing
        this.setSize(this.width, this.height/4).setOffset(0, 3 * this.height/4)
        // speed variable
        this.BIKE_VELOCITY = 300 // technically acceleration
        this.BIKE_MAX_VELOCITY = 500
        this.BIKE_DRAGX = 150
        this.BIKE_DRAGY = 200

        // set drag & disable gravity
        this.setDrag(this.BIKE_DRAGX, this.BIKE_DRAGY)
        this.body.setAllowGravity(false)
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

        this.setAcceleration(this.BIKE_VELOCITY * playerVector.x, this.BIKE_VELOCITY * playerVector.y)
        
    }

    unseated() {
        this.setAcceleration(0, 0)
        
    }
}