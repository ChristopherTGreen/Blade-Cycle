class HoverGuard extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing
        

        this.speed = 50.0
        this.setDragX = 5.0
        this.setFrictionX(1.0)
    }

    create() {
        
    }

    update() {

        
    }

    // given target, will chase
    chase(target) {
        const locationX = (target.x > this.x) ? 1 : -1
        const distance = Math.abs(target.x - this.x)
        if (distance > 50) this.body.setAccelerationX(this.speed * locationX)
        else {
            this.body.setAccelerationX(0)
            this.body.velocity.x = this.body.velocity.x/1.1
        }
    }

    physicsEstablish(){
        this.setSize(64, 4)
        this.setImmovable(true)
        this.body.setAllowGravity(false)
        this.speed = 100.0
        this.setDragX = 5.0
        this.setFrictionX(1.0)
    }
}