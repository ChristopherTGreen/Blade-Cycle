class HoverGuardTest extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame, direction, target) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing
    
        // properties
        this.accel = 100.0
        this.direction = direction
        this.firing = false
        this.trackingDist = 50
        this.hp = 100.0

        this.setDragX = 50.0
        this.setFrictionX(1.0)

        // physics
        this.setSize(64, 4)
        this.setImmovable(true)
        this.body.setAllowGravity(false)
        console.log("called constructor")

        // initialize state machine managing hero (initial state, possible states, state args[])
        scene.guardFSM = new StateMachine('patrol', {
            patrol: new PatrolState(),
            fire: new FireState(),
            cooldown: new CooldownState(),
            death: new DeathState(),
        }, [scene, this, target]) // scene context
    }
}

// guard-specific state classes
// idle essentially means no target locked
// cases: 
//          player is on top of guard
class PatrolState extends State {
    // executes every call/frame
    execute(scene, enemy, target) {
        // direction found through boolean
        const directionX = (target.x > enemy.x) ? 1 : -1
        const distance = Math.abs(target.x - enemy.x)

        let enemyVector = new Phaser.Math.Vector2(0, 0)

        // aligns itself with enemy on the x axis, before slowing down
        if (distance > enemy.trackingDist) {
            enemyVector.x = (directionX > 0) ? 1 : -1 
        }
        console.log(enemyVector.x)
        console.log(enemy.body.acceleration.x)
        enemy.body.setAccelerationX(enemy.accel * enemyVector.x)


        // detection to fire & charge weapon
        if (distance < 100 && distance > enemy.trackingDist/2) {
            // wait 500ms to fire (if still alive)
            scene.time.delayedCall(500, () => {
                if (enemy && enemy.active) this.stateMachine.transition('fire')
            })
            this.stateMachine.transition('fire')
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
        // clear tint if we have one
        console.log("Fired")

        // end fire state
        this.stateMachine.transition('cooldown')
    }
}

// cooldown: period of unable to fire, same as the patrol without ability to fire
class CooldownState extends State {
    enter(scene, enemy, target) {
        scene.time.delayedCall(1000, () => {
            if (enemy && enemy.active) this.stateMachine.transition('patrol')
            // double check if this works
        })
    }

    // executes every call/frame
    execute(scene, enemy, target) {
        // direction found through boolean
        const directionX = (target.x > enemy.x) ? 1 : -1
        const distance = Math.abs(target.x - enemy.x)

        let enemyVector = new Phaser.Math.Vector2(0, 0)

        // aligns itself with enemy on the x axis, before slowing down
        if (distance > enemy.trackingDist) {
            enemyVector.x = (directionX > 0) ? 1 : -1 
        }
        console.log(enemyVector.x)
        console.log(enemy.body.acceleration.x)

        enemy.body.setAccelerationX(enemy.accel * enemyVector.x)

        // detection if death & transition to death
        if (enemy.hp <= 0) {
            this.stateMachine.transition('death')
        }
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