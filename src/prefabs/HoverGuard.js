class HoverGuard extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame, direction, target) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing
    
        // properties
        this.accelX = 100.0
        this.accelY = 50.0
        this.direction = direction
        this.firing = false
        this.trackingDist = 50
        this.hp = 100.0
        this.target = target

        // physics
        this.setSize(64, 4)
        this.setImmovable(true)
        this.body.setAllowGravity(false)
        console.log("called constructor")

        // initialize state machine managing hero (initial state, possible states, state args[])
        this.guardFSM = new StateMachine('patrol', {
            patrol: new PatrolState(),
            fire: new FireState(),
            death: new DeathState(),
        }, [scene, this, this.target]) // scene context
    }
}

// guard-specific state classes
// idle essentially means no target locked
// cases: 
//          player is on top of guard
class PatrolState extends State {
    // executes every call/frame
    execute(scene, enemy, target) {
        // checks status of target, might need to switch
        if (!scene.statusCycle) target = scene.player
        
        // x movement
        // direction found through boolean
        const directionX = (target.x > enemy.x) ? 1 : -1
        const distanceX = Math.abs(target.x - enemy.x)
        const distance = Math.abs(Math.pow(Math.pow(target.x - enemy.x, 2) + Math.pow(target.y - enemy.y, 2), 1/2))

        let enemyVector = new Phaser.Math.Vector2(0, 0)

        // aligns itself with enemy on the x axis, before slowing down
        // secondary condition, if player is too close, will cancel (only applies if player is not in cycle)
        if (distance > enemy.trackingDist && distanceX / enemy.body.acceleration.x > enemy.trackingDist) {
            enemyVector.x = (directionX > 0) ? 1 : -1 
        }

        enemy.body.setAccelerationX(enemy.accelX * enemyVector.x)

        // y movement
        // finds distance on the y
        // very similar to soldierbike, but will always try to be high up slightly
        const distanceY = target.y - enemy.y

        // aligns itself with enemy above or below, relative to player's y axis, and closest position
        if (distance > enemy.trackingDist && enemy.y < target.y && distanceY > enemy.trackingDist*Phaser.Math.Between(4, 5)) {
            console.log("guard: above")
            enemyVector.y = 1
        }
        else if (distance > enemy.trackingDist && enemy.y > target.y - enemy.trackingDist/2){
            console.log("guard: too low")
            enemyVector.y = -1
        }
        
        enemy.body.setAccelerationY(enemy.accelY * enemyVector.y)
        
        // detection to fire & charge weapon
        if (distance < 300 && distance > enemy.trackingDist && !enemy.firing) {
            enemy.firing = true
            // wait 500ms to fire (if still alive)
            scene.time.delayedCall(1000, () => {
                if (enemy && enemy.active) this.stateMachine.transition('fire')
            })
        }

        // detection if death & transition to death
        if (enemy.hp <= 0) {
            this.stateMachine.transition('death')
        }
    }
}

// fire: essentially is the process of shooting
class FireState extends State {
    // executes every call/frame
    execute(scene, enemy, target) {
        // checks status of target, might need to switch
        if (!scene.statusCycle) target = scene.player

        // clear tint if we have one
        scene.fireCall(enemy, target)
        enemy.firing = false

        // end fire state
        this.stateMachine.transition('patrol')
    }
}

// death: hp is 0, and guard is destroyed and deleted
class DeathState extends State {
    // executes every call/frame
    execute(scene, enemy, target) {
        // clear tint if we have one
        console.log("Death")

        // delete (wip)
        this.stateMachine.transition('patrol')
    }
}