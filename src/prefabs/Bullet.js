class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, source) {
        super(scene, x, y, 'bullet', 0)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing
    
        // properties
        this.speed = 100
        this.lifeTime = 10000
        this.setSize(2, 2)
        this.setDepth(1000)
        this.damagePossible = false
        if (source !== null) this.firingSource = source
        else this.firingSource = null

        this._temp = new Phaser.Math.Vector2()
    }

    
    // update is called automatically
    update(time, delta) {
        this.lifeTime -= delta

        if (this.firingSource !== null) this.setPosition(this.firingSource.x + this.firingSource.fireOffsetX, this.firingSource.y + this.firingSource.fireOffsetY)
        if (this.firingSource !== null && !(this.firingSource && this.firingSource.active && this.firingSource.body)) {
            this.lifeTime = 0
        }

        if (this.lifeTime <= 0) {
            this.lifeTime = 0
            this.setActive(false)
            this.setVisible(false)
            this.disableBody(true, true)
        }
    }

    // initates a charging animation, and upon completion, fires a bullet, returning the specific bullet which fired
    // each source must have a fireOffsetX and Y
    // need firingSource in order to make sure source is still alive when fired
    // optional: can have the indicator latch onto the source if it has a firingSource
    fireBullet(scene, source, target) { 
        if (source) { 
            // initial reset for this bullet (issues with all sharing same variable for some reason)
            this.lifeTime = 10000
            this.damagePossible = false

            this.body.enable    
            this.setActive(true)
            this.setVisible(true)
            let angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(source.x + source.fireOffsetX, source.y + source.fireOffsetY, target.x, target.y))
            this.setAngle(angle)
            this.setPosition(source.x + source.fireOffsetX, source.y + source.fireOffsetY)
            this.body.reset(source.x + source.fireOffsetX, source.y + source.fireOffsetY)

            this.anims.play('indication')
            this.once('animationcomplete', () => {
                scene.sound.play('fire-sound')
                // return if source is destroyed
                if (!(source && source.active && source.body)) {
                    this.lifeTime = 0
                    return
                }

                // sets damage to possible, since charging state has ended
                this.damagePossible = true
                
                // once animation completed, velocity on and new animation plays while flying
                this.setPosition(source.x + source.fireOffsetX, source.y + source.fireOffsetY)
                this.body.reset(source.x + source.fireOffsetX, source.y + source.fireOffsetY)

                scene.physics.velocityFromAngle(angle, this.speed, this.body.velocity)
                this.anims.play('flying', true)

                // optional
                // position lock
                if (this.firingSource !== null) this.firingSource = null
            })
        }
    }
    
}
