class PlayerTest extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame, direction, target) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing
    
        // properties
        this.accelX = 300.0 // maybe make velocity for more control
        this.accelY = 300.0
        this.maxAccel = 300.0

        this.direction = direction
        this.hp = 400.0
        this.initialDist = true

        // physics
        this.setSize(this.width/4, this.height/2).setOffset(this.width/2-8, this.height/4)
        this.body.setCollideWorldBounds(true)
        this.body.setGravityY(300)
        this.setDragX(200)
        this.body.setAllowGravity(false)
        console.log("called constructor play")


        // initialize state machine managing hero (in9itial state, possible states, state args[])
        scene.playerFSM = new StateMachine('inactive', {
            inactive: new InactiveState(),
            idle: new IdleState(),
            move: new MoveState(),
            jump: new JumpState(),
            stab: new StabState(),
            deathP: new DeathPState(),
        }, [scene, this]) // scene context
    }
}



// player state classes
// inactive: player is not activated now, and player is disabled, but tracked ontop of bike
class InactiveState extends State {
    // executes intially, disables parameters
    enter(scene, player) {
        scene.playerHitbox.active = false
        scene.statusCycle = true
        player.setAlpha(0.0)
        player.body.setAllowGravity(false)
        
        scene.bike.hp = player.hp
        player.initialDist = true

        // call to the player to stop all acceleration/reset it
        player.setAccelerationX(0)
        player.setVelocity(0, 0)
    }
    // executes every call/frame
    execute(scene, player) {
        player.x = scene.bike.x
        player.y = scene.bike.y

        

        if (keySPACE.isDown) {
            console.log('transition')
            player.body.setVelocityX(scene.bike.body.velocity.x)
            player.body.setVelocityY(-400)
            scene.statusCycle = false
            scene.playerHitbox.active = true
            player.setAlpha(1.0)
            player.body.setAllowGravity(true)
            player.initialDist = false

            
            this.stateMachine.transition('jump')
        }

    }
}

// idle is the standard state
// cases: 
//          player is still
class IdleState extends State {
    // enter initial call
    enter (scene, player) {
        player.anims.play(`idle-${player.direction}`) // change to direction later
    }

    // executes every call/frame
    execute(scene, player) {
        console.log('idle')
        // movement transition
        if(keyLEFT.isDown || keyRIGHT.isDown) {
            this.stateMachine.transition('move')
        }

        if(keySPACE.isDown) {
            this.stateMachine.transition('jump')
        }

        // stab down
        if (keyARDOWN.isDown) {
            this.stateMachine.transition('stab')
        }

        // detection if death & transition to death
        if (player.hp <= 0) {
            this.stateMachine.transition('deathP')
        }

        if (player.body.y > game.config.height - 40) this.stateMachine.transition('inactive')

    }
}

// move is when player is non idle or has an input
// cases: 
//          player is on the ground
class MoveState extends State {
    // executes every call/frame
    execute(scene, player) {
        // use destructuring to make a local copy of the keyboard object
        let playerVector = new Phaser.Math.Vector2(0, 0)
        console.log('move')
        
        
        if(keyLEFT.isDown) {
            player.direction = 'left'
            playerVector.x = -1
        } else if(keyRIGHT.isDown) {
            player.direction = 'right'
            playerVector.x = 1
        }

        if(keySPACE.isDown || !player.body.onFloor()) {
            if(keySPACE.isDown) player.body.setVelocityY(-300)
            this.stateMachine.transition('jump')
        }

        player.setAccelerationX(player.accelX * playerVector.x)
        player.anims.play(`move-${player.direction}`)

        // check if the player is static relative to body
        if (player.body.accelerationX == 0) this.stateMachine.transition('idle')

        // stab down
        if (keyARDOWN.isDown) {
            this.stateMachine.transition('stab')
        }

        // detection if death & transition to death
        if (player.hp <= 0) {
            this.stateMachine.transition('deathP')
        }

        if (player.body.y > game.config.height - 30) this.stateMachine.transition('inactive')
    }
}

// jump is when player is falling or jumping
// cases: 
//          player is not on the ground
class JumpState extends State {
    // executes every call/frame
    execute(scene, player) {
        console.log('jump')
        // use destructuring to make a local copy of the keyboard object
        let playerVector = new Phaser.Math.Vector2(0, 0)
        
        
        if(keyLEFT.isDown) {
            player.direction = 'left'
            playerVector.x = -1
        } else if(keyRIGHT.isDown) {
            player.direction = 'right'
            playerVector.x = 1
        }

        if(player.body.onFloor()) {
            this.stateMachine.transition('idle')
        }

        player.setAccelerationX(player.accelX * playerVector.x)


        if (player.body.velocity.x >= 0) player.direction = 'right'
        else player.direction = 'left'
        player.anims.play(`move-jump${player.direction}`)

        // detection if death & transition to death
        if (player.hp <= 0) {
            this.stateMachine.transition('deathP')
        }

        //distance checker
        const distance = Math.abs(Math.pow(Math.pow(scene.bike.x - player.x, 2) + Math.pow(scene.bike.y - player.y, 2), 1/2))
        if ((!player.initialDist && distance > 60) || player.body.blocked.down) player.initialDist = true
        else if (player.initialDist && distance < 60) this.stateMachine.transition('inactive')
    }
}

// stab: player stabs the ground, can't move for a split second until animation
class StabState extends State {
    enter(scene, player) {
        console.log('stab')
        player.setAcceleration(0, 0)
        player.setVelocity(0, 0)
        player.anims.play(`stab-down`)
        player.once('animationcomplete', () => {
            // check collision when animation is stab-down
            // create semi hitbox?
            this.stateMachine.transition('idle')
        })
    }
}

// death: hp is 0, and player is killed
class DeathPState extends State {
    // executes every call/frame
    execute(scene, player) {
        console.log('death')
        // clear tint if we have one
        console.log("Death")
        scene.scene.restart()
        // delete (wip)
        this.stateMachine.transition('idle')
    }
}