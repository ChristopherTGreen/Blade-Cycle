class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, 'bullet', 0)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing
    
        // properties
        this.speed = 100
        this.lifeTime = 10000
        this.setSize(4, 4)

        this._temp = new Phaser.Math.Vector2()
    }

    fire (source, target) {
        this.lifeTime = 5000

        this.setActive(true)
        this.setVisible(true)
        let angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(source.x, source.y, target.x, target.y))
        this.setAngle(angle)
        this.setPosition(source.x, source.y)
        this.body.reset(source.x, source.y)

        this.scene.physics.velocityFromAngle(angle, this.speed, this.body.velocity)
        this.anims.play('flying', true)
    }

    update (time, delta) {
        this.lifeTime -= delta

        if (this.lifeTime <= 0) {
            this.setActive(false)
            this.setVisible(false)
            this.body.stop()
        }
    }
}
