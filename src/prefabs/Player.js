class Player extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame, direction, target) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing
    
        // properties
        this.accelX = 300.0 // maybe make velocity for more control
        this.accelY = -350.0
        this.maxAccel = 300.0

        this.direction = direction
        this.hp = 500.0
        this.initialDist = true
        this.coyoteTime = 2000
        this.coyote = true

        // physics
        const sizeDiffW = 60
        const sizeRateW = 1.92 // only for offset
        const sizeDiffY = 30
        const sizeRateY = 1.3 // only for offset
        this.setSize(this.width - sizeDiffW, this.height - sizeDiffY).setOffset(sizeDiffW/sizeRateW, sizeDiffY/sizeRateY - 8)
        this.body.setCollideWorldBounds(true)
        this.body.setGravityY(300)
        this.setDragX(200)
        this.body.setAllowGravity(false)
        this.setMaxVelocity(150, 400)
        console.log("called constructor play")

        // stab damageboxes
        this.hitboxSizeV = 30
        this.stabHitbox = scene.add.zone(0, 0, 18, this.hitboxSizeV);
        scene.physics.add.existing(this.stabHitbox);
        this.stabHitbox.body.setAllowGravity(false);
        this.stabHitbox.body.enable = false; // Start disabled
        this.hitboxX = 10
        this.hitboxDownY = 10

        // jump sound
        this.jumpSound = scene.sound.add('jump-sound', {
            volume: game.settings.volume
        })

        // hitbox for the player
        scene.playerHitbox = scene.physics.add.overlap(this, scene.bullets, (target, bullet) => {
            if (!this.recentHit && bullet.damagePossible) {
                // period of delay from damage
                this.recentHit = true

                bullet.lifeTime = 0
                target.hp -= 25
                console.log('hit')

                // time of red hit and time of vulnerability
                scene.damageHit(this, 300, 100)
                scene.damageHit(scene.bike, 300, 100)
            }
        })


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
        player.setAcceleration(0, 0)
        player.setVelocity(0, 0)
    }
    // executes every call/frame
    execute(scene, player) {
        player.setAlpha(0.0)
        player.x = scene.bike.x
        player.y = scene.bike.y
        // resetter to prevent character from accidentally appearing or unintended collisions

        if (keySPACE.isDown) {
            console.log('transition')
            // jump sound
            player.jumpSound.play()

            player.body.setVelocityX(scene.bike.body.velocity.x)
            player.body.setVelocityY(player.accelY - 100)
            scene.statusCycle = false
            scene.playerHitbox.active = true
            player.setAlpha(1.0)
            player.body.setAllowGravity(true)
            player.initialDist = false

            // safehitbox for transition, less annoying gameplay
            player.recentHit = true
            scene.safeTimeHit(player, 50, true)
            
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
        let playerVector = new Phaser.Math.Vector2(0, 0)
        // movement transition
        if(keyLEFT.isDown || keyRIGHT.isDown) {
            this.stateMachine.transition('jump')
        }

        player.setAccelerationX(player.accelX * playerVector.x)

        // jump
        if(keySPACE.isDown) {
            if(keySPACE.isDown) {
                player.body.setVelocityY(player.accelY)
                player.coyote = false

                // jump sound
                player.jumpSound.play()
            }
            this.stateMachine.transition('jump')
        }

        // stab down
        if (keyARDOWN.isDown) {
            player.direction = 'down'
            this.stateMachine.transition('stab')
        }

        // detection if death & transition to death
        if (player.hp <= 0) {
            this.stateMachine.transition('deathP')
        }

        if (player.body.y > game.config.height - 40) {
            scene.damageHit(player, 300, 100)
            scene.damageHit(scene.bike, 300, 100)
            player.hp -= 25
            player.recentHit = true
            this.stateMachine.transition('inactive')
        }
        
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
            console.log('left')
            playerVector.x = -1
        } else if(keyRIGHT.isDown) {
            player.direction = 'right'
            console.log('right')
            playerVector.x = 1
        }

        if(keySPACE.isDown || !player.body.onFloor()) {
            if(keySPACE.isDown) {
                player.body.setVelocityY(player.accelY)
                player.coyote = false

                // jump sound
                player.jumpSound.play()
            }
            this.stateMachine.transition('jump')
        }

        player.setAccelerationX(player.accelX * playerVector.x)
        player.anims.play(`move-${player.direction}`)

        // check if the player is static relative to body
        if (player.body.velocity.x == 0 && player.body.accelerationX == 0) this.stateMachine.transition('idle')

        // stab down
        if (keyARDOWN.isDown) {
            player.direction = 'down'
            this.stateMachine.transition('stab')
        }

        // detection if death & transition to death
        if (player.hp <= 0) {
            this.stateMachine.transition('deathP')
        }

        if (player.body.y > game.config.height - 40) {
            scene.damageHit(player, 300, 100)
            scene.damageHit(scene.bike, 300, 100)
            player.hp -= 25
            player.recentHit = true
            this.stateMachine.transition('inactive')
        }
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

        // coyote jump
        if(keySPACE.isDown && player.coyote) {
            player.body.setVelocityY(player.accelY)
            player.coyote = false
            
            // jump sound
            player.jumpSound.play()
        }
        if (player.coyote) scene.time.delayedCall(player.coyoteTime, () => {
            player.coyote = false
        })
        
        
        if(keyLEFT.isDown) {
            player.direction = 'left'
            playerVector.x = -1
        } else if(keyRIGHT.isDown) {
            player.direction = 'right'
            playerVector.x = 1
        }

        if(player.body.onFloor()) {
            player.coyote = true
            this.stateMachine.transition('move')
        }

        player.setAccelerationX(player.accelX * playerVector.x)


        if (player.body.velocity.x >= 0) player.direction = 'right'
        else player.direction = 'left'
        player.anims.play(`move-jump${player.direction}`)

        // detection if death & transition to death
        if (player.hp <= 0) {
            player.coyote = true
            this.stateMachine.transition('deathP')
        }

        //distance checker to be reseated
        const distance = Math.abs(Math.pow(Math.pow(scene.bike.x - player.x, 2) + Math.pow(scene.bike.y - player.y, 2), 1/2))
        const distanceX = Math.abs(scene.bike.x - player.x)
        const distanceY = Math.abs(scene.bike.y - player.y)
        if ((!player.initialDist && distance > 60) || player.body.blocked.down) player.initialDist = true
        else if (player.initialDist && distanceY <= 40 && distanceX <= 120) {
            player.coyote = true
            this.stateMachine.transition('inactive')
        }
    }
}

// stab: player stabs the ground, can't move for a split second until animation
class StabState extends State {
    enter(scene, player) {
        player.setAcceleration(0, 0)
        player.setVelocity(0, 0)
        player.anims.play(`stab-down`)
        scene.soundStab.play()

        
        // delayed damage for more effect
        scene.time.delayedCall(300, () => {
            player.stabHitbox.body.enable = true
            // damage hitbox
            player.stabHitbox.x = player.x + player.hitboxX
            player.stabHitbox.y = player.y + ((player.direction == 'up') ? player.hitboxUpY : player.hitboxDownY)
        })

        player.once('animationcomplete', () => {      
            player.direction = 'right'
            this.stateMachine.transition('idle')
        })

        
    }

}

// death: hp is 0, and player is killed
class DeathPState extends State {
    // upon death plays audio once
    enter(scene, player) {
        console.log('death')
        // clear tint if we have one

        scene.deathAnim(player, 300, false)
        
        scene.time.delayedCall(400, () => {
            scene.sound.stopAll()
            scene.scene.restart()
        })
    }
}