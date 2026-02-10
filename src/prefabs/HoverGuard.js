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
        this.trackingDist = 40 // tracking distance for both x/y (optional, good if the collision process removes the setVelocity to zero, and disabling firing)
        this.trackingMOE = 20 // margin of error for tracking dist, in which it starts going back and forth within this area (sensitive due to being tied to vel)
        this.firingRange = 200
        this.firingLimitR = 50
        this.hp = 100.0
        this.target = target
        this.recentHit = false

        // fireOffset
        this.fireOffsetX = 10
        this.fireOffsetY = 20

        // physics
        this.setSize(64, 10).setOffset(0, this.height/2 - 5)
        this.setImmovable(true)
        this.body.setAllowGravity(false)
        console.log("called constructor")

        // hitbox for the slash, causes damage
        scene.physics.add.overlap(scene.player.stabHitbox, this, (hitbox, enemy) => {
            if (hitbox.body.enable && !enemy.recentHit) {
                enemy.hp -= 25.0
                console.log('success hitttttttttt')
                hitbox.body.enable = false
                enemy.recentHit = true

                // time of red hit and time of vulnerability
                scene.damageHit(enemy, 25, 25)
            }
        })

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

        const avoidRate = 8
        const avoidCycleRate = 7
        const avoidPlayerRate = 4
        
        let enemyVector = new Phaser.Math.Vector2(0, 0)

        // aligns itself with enemy on the x axis, before slowing down
        // secondary condition, if player is too close, will cancel (only applies if player is not in cycle)
        if (scene.statusCycle && distance > enemy.trackingDist && distanceX - (enemy.body.acceleration.x/20) > enemy.trackingMOE * avoidRate) {
            enemyVector.x = (directionX > 0) ? 1 : -1
        }
        else if (!scene.statusCycle && distance > enemy.trackingDist && distanceX < enemy.trackingMOE * avoidPlayerRate*2) {
            // if outside zone, close in, if too close, pull away
            if (distanceX < enemy.trackingMOE * avoidPlayerRate) enemyVector.x = (directionX > 0) ? -1 : 1
            else enemyVector.x = (directionX > 0) ? 1 : -1
        }

        enemy.body.setAccelerationX(enemy.accelX * enemyVector.x)

        // y movement
        // finds distance on the y
        // very similar to soldierbike, but will always try to be high up slightly
        // note: two cases, player or cycle, player means less vertical height, cycle means more height (doesn't stop moving from distance)
        const distanceY = target.y - enemy.y

        // aligns itself with enemy above or below, relative to player's y axis, and closest position
        if (distance > enemy.trackingDist && enemy.y < target.y && distanceY + (1 + Math.abs(enemy.body.acceleration.y/10)) > enemy.trackingMOE*avoidRate) {
            console.log("guard: going roughly above target, downwards")
            enemyVector.y = 1
        }
        else if (scene.statusCycle && distanceY < enemy.trackingMOE * avoidCycleRate){
            console.log("guard: too low, rising")
            enemyVector.y = -1
        }
        else if (!scene.statusCycle && distance > enemy.trackingDist && distanceY < enemy.trackingMOE * avoidPlayerRate){
            console.log("guard: too low, rising")
            enemyVector.y = -1
        }

        enemy.body.setAccelerationY(enemy.accelY * enemyVector.y)
        
        // detection to fire & charge weapon
        if (distance < enemy.firingRange && distance > enemy.firingLimitR && !enemy.firing) {
            enemy.firing = true
            // wait 500ms to fire (if still alive)
            scene.time.delayedCall(2000, () => {
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

        scene.fireCall(enemy, target)
            
        // cooldown
        scene.time.delayedCall(1000, () => {
            if (enemy && enemy.active) enemy.firing = false
        })

 
        this.stateMachine.transition('patrol')
    }
}

// death: hp is 0, and guard is destroyed and deleted
class DeathState extends State {
    // executes every call/frame
    execute(scene, enemy, target) {
        // clear tint if we have one
        console.log("Death")

        scene.deathAnim(enemy, 300, true)
    }
}