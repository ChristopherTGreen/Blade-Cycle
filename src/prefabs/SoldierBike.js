class SoldierBike extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing
        
        // values
        this.VELOCITY_X = 50.0
        this.VELOCITY_Y = 20.0
        // limitations
        this.setDragX = 5.0
        this.setFrictionX(1.0)

        // other
        this.setSize(this.width, this.height/4).setOffset(0, 3 * this.height/4)
        this.setImmovable(true)
        this.body.setAllowGravity(false)
        console.log("called constructor")
    }

    create() {
        
    }

    update() {
        
    }

    // given target, will chase
    chase(target) {
         // direction found through boolean
        const locationX = (target.x > this.x) ? 1 : -1
        const distanceX = Math.abs(target.x - this.x)
        // aligns itself with enemy on the x axis, before slowing down
        if (distanceX > 40) this.body.setAccelerationX(this.VELOCITY_X * locationX)
        else {
            this.body.setAccelerationX(0)
            this.body.velocity.x = this.body.velocity.x/1.1
        }

        const attackRange = 30  
        const distanceY = Math.abs(target.y - this.y)

        // aligns itself with enemy above or below, relative to player's y axis, and closest position
        if (this.y > target.y && distanceY > attackRange) {
            console.log("below")
            this.body.setAccelerationY(-this.VELOCITY_Y)
        }
        else if (this.y < target.y && distanceY > attackRange ) {
            console.log("above")
            this.body.setAccelerationY(this.VELOCITY_Y)
        }
        else {
            this.body.setAccelerationY(0)
            this.body.setVelocityY(0)
        }
    }
}