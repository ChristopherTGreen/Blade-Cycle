class HoverGuard extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing
        
        // Values
        this.VELOCITY = 100.0

        // limitations
        this.setDragX = 5.0
        this.setFrictionX(1.0)

        // other (fix)
        this.setSize(64, 4)
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
        const distance = Math.abs(target.x - this.x)
        // aligns itself with enemy on the x axis, before slowing down
        if (distance > 50) this.body.setAccelerationX(this.VELOCITY * locationX)
        else {
            this.body.setAccelerationX(0)
            this.body.velocity.x = this.body.velocity.x/1.1
        }

    }
}