class SoldierBike extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame, direction, target) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing
    
        // properties
        this.accelX = 140.0
        this.accelY = 50.0

        this.direction = direction
        this.firing = false
        this.trackingDist = 10
        this.firingRangeY = 150
        this.firingRangeX = 80
        this.hp = 100.0
        this.target = target
        this.recentHit = false

        // fireOffset
        this.fireOffsetX = 16
        this.fireOffsetY = 8

        // physics
        this.setSize(this.width, this.height/4).setOffset(0 , 2 * this.height/3)
        this.setImmovable(true)
        this.body.setAllowGravity(false)
        console.log("called constructor ah")

        // hitbox for the slash, causes damage
        scene.physics.add.overlap(scene.bike.slashHitbox, this, (hitbox, enemy) => {
            if (hitbox.body.enable && !enemy.recentHit) {
                enemy.hp -= 50.0
                console.log('success hitttttttttt')
                hitbox.body.enable = false
                enemy.recentHit = true

                // time of red hit and time of vulnerability
                scene.damageHit(enemy, 75, 25)
            }
        })

        // initialize state machine managing hero (initial state, possible states, state args[])
        this.soldierFSM = new StateMachine('chase', {
            chase: new ChaseState(),
            fireSoldier: new FireSoldierState(),
            deathB: new DeathBState(),
        }, [scene, this, this.target]) // scene context
    }
}
// guard-specific state classes
// idle essentially means no target locked
// cases: 
//          player is on top of guard
class ChaseState extends State {
    // executes every call/frame
    execute(scene, enemy, target) {
        // x movement
        // direction found through boolean
        const directionX = (target.x > enemy.x) ? 1 : -1
        const distanceX = Math.abs(target.x - enemy.x)
        const distance = Math.abs(Math.pow(Math.pow(target.x - enemy.x, 2) + Math.pow(target.y - enemy.y, 2), 1/2))

        let enemyVector = new Phaser.Math.Vector2(0, 0)

        const closeTrackingX = 40

        // aligns itself with enemy on the x axis, before slowing down
        // secondary condition, if player is too close, will cancel
        if (distance > enemy.trackingDist && distanceX / enemy.body.acceleration.x > enemy.trackingDist && distanceX > closeTrackingX) {
            enemyVector.x = (directionX > 0) ? 1 : -1 
        }

        // y movement
        // finds distance on the y
        const distanceY = Math.abs(target.y - enemy.y)
        const farTrackingY = 80 // higher means further far
        const closeTrackingY = 35 // higher means less close
        // example: 40 far, 10 close, means a 30 gap distance or margin of error allowed

        // aligns itself with enemy above or below, relative to player's y axis, and closest position
        if ((enemy.y > target.y && distanceY > farTrackingY) || ( enemy.y < target.y && distanceY < closeTrackingY)) {
            console.log("soldier: go above")
            enemyVector.y = -1
        }
        else if ((enemy.y < target.y && distanceY > farTrackingY) || (enemy.y > target.y && distanceY < closeTrackingY)) {
            console.log("soldier: go below")
            enemyVector.y = 1
        }
      
        // secondary movement for x, bypasses priority in situation in which too close on y axis
        if (distanceY < closeTrackingY && distanceX < closeTrackingX) {
            enemyVector.x = (directionX > 0) ? -1 : 1
            console.log('close soldier, back')
        }


        enemy.body.setAccelerationX(enemy.accelX * enemyVector.x)
        enemy.body.setAccelerationY(enemy.accelY * enemyVector.y)
        
        // detection to fire & charge weapon with animation
        // checks if enemy is within firing range and if the player has fired already
        if (distanceX < enemy.firingRangeX && distanceY < enemy.firingRangeY && !enemy.firing) {
            enemy.firing = true

            // wait 500ms to fire (if still alive)
            scene.time.delayedCall(500, () => {
                if (enemy && enemy.active) this.stateMachine.transition('fireSoldier')
            })
        }

        // detection if death & transition to death
        if (enemy.hp <= 0) {
            this.stateMachine.transition('deathB')
        }
    }
}

// fire: essentially is the process of shooting
class FireSoldierState extends State {
    // executes every call/frame
    execute(scene, enemy, target) {
        // checks status of target, might need to switch
        if (!scene.statusCycle) target = scene.player

        scene.fireCall(enemy, target)
            
        // cooldown
        scene.time.delayedCall(750, () => {
            if (enemy && enemy.active) enemy.firing = false
        })

        this.stateMachine.transition('chase')
    }
}

// death: hp is 0, and bike is destroyed and deleted
class DeathBState extends State {
    // death plays on entry
    enter(scene, enemy, target) {
        // clear tint if we have one
        console.log("Death")
        scene.deathAnim(enemy, 500, true)
        scene.score += 50
    }
}