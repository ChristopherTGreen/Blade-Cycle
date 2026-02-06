class SoldierBike extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame, direction, target) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing
    
        // properties
        this.accelX = 60.0
        this.accelY = 40.0
        this.direction = direction
        this.firing = false
        this.trackingDist = 20
        this.hp = 100.0
        this.target = target

        // physics
        this.setSize(this.width, this.height/4).setOffset(0, 3 * this.height/4)
        this.setImmovable(true)
        this.body.setAllowGravity(false)
        console.log("called constructor ah")

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

        // aligns itself with enemy on the x axis, before slowing down
        // secondary condition, if player is too close, will cancel
        if (distance > enemy.trackingDist && distanceX / enemy.body.acceleration.x > enemy.trackingDist) {
            enemyVector.x = (directionX > 0) ? 1 : -1 
        }

        enemy.body.setAccelerationX(enemy.accelX * enemyVector.x)

        // y movement
        // finds distance on the y
        const distanceY = Math.abs(target.y - enemy.y)

        // aligns itself with enemy above or below, relative to player's y axis, and closest position
        if (enemy.y > target.y && distanceY > 70) {
            console.log("soldier: below")
            enemyVector.y = -1
        }
        else if (enemy.y < target.y && distanceY > 70) {
            console.log("soldier: above")
            enemyVector.y = 1
        }
        
        enemy.body.setAccelerationY(enemy.accelY * enemyVector.y)
        
        // detection to fire & charge weapon
        if (distance < 300 && distance > enemy.trackingDist && !enemy.firing) {
            enemy.firing = true
            // wait 500ms to fire (if still alive)
            scene.time.delayedCall(1000, () => {
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

        // clear tint if we have one
        scene.fireCall(enemy, target)
        enemy.firing = false

        // end fire state
        this.stateMachine.transition('chase')
    }
}

// death: hp is 0, and bike is destroyed and deleted
class DeathBState extends State {
    // executes every call/frame
    enter(scene, enemy, target) {
        // clear tint if we have one
        console.log("Death")

        enemy.setActive(false)
        enemy.setVisible(false)
        enemy.disableBody(true, true)
        enemy.destroy()
        
    }
}