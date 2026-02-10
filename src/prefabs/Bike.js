class Bike extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)    // add to existing
        scene.physics.add.existing(this) // add physics to existing
    
        // properties
        this.accelX = 300.0 // maybe make velocity for more control
        this.accelY = 200.0
        this.maxAccel = 500.0
        this.bikeSlash = true

        this.direction = direction
        this.hp = 500.0
        this.recentHit = false

        // physics
        const sizeDiff = 16
        this.setSize(this.width - sizeDiff, this.height/4).setOffset(sizeDiff/2, 2 * this.height/4)
        this.setCollideWorldBounds
        this.setDrag(150, 200)
        this.body.setAllowGravity(false)
        console.log("called constructor play")

        // bike slash damageboxes
        this.hitboxSizeV = 20
        this.slashHitbox = scene.add.zone(0, 0, 40, this.hitboxSizeV);
        scene.physics.add.existing(this.slashHitbox);
        this.slashHitbox.body.setAllowGravity(false);
        this.slashHitbox.body.enable = false; // Start disabled
        this.hitboxX = 10
        this.hitboxDownY = 25
        this.hitboxUpY = -25

        // hitbox for the cycle
        scene.cycleHitbox = scene.physics.add.overlap(this, scene.bullets, (target, bullet) => {
            if (!this.recentHit) {
                // period of delay from damage
                this.recentHit = true

                bullet.lifeTime = 0
                target.hp -= 25
                console.log('hit')

                // time of red hit and time of vulnerability
                scene.damageHit(this, 300, 100)
                scene.damageHit(scene.player, 300, 100)
            }
        })
        


        // initialize state machine managing hero (in9itial state, possible states, state args[])
        scene.bikeFSM = new StateMachine('idleBike', {
            inactiveBike: new InactiveBikeState(),
            idleBike: new IdleBikeState(),
            moveBike: new MoveBikeState(),
            slash: new SlashState(),
            deathBike: new DeathBikeState(),
        }, [scene, this]) // scene context
    }
}



// player state classes
// inactive: player is not activated now, and player is disabled, but tracked ontop of bike
class InactiveBikeState extends State {
    // executes intially, disables parameters
    enter(scene, bike) {
        scene.player.hp = bike.hp
        // reverse below
        scene.cycleHitbox.active = false
        bike.anims.play('empty-bike')

        // call to the bike to stop all acceleration/reset it
        bike.setAcceleration(0, 0)
    }
    // executes every call/frame
    execute(scene, bike) {

        if (scene.statusCycle) {
            console.log('transition')
            scene.bike.anims.play('riding-bike')
            
            bike.body.setVelocityX(scene.bike.body.velocity.x)
            scene.cycleHitbox.active = true
    
            this.stateMachine.transition('idleBike')
        }

    }
}

// idle is the standard state
// cases: 
//          player is still
class IdleBikeState extends State {
    // enter initial call
    enter (scene, bike) {
        
    }

    // executes every call/frame
    execute(scene, bike) {
        console.log('idle Bike')
        bike.direction = 'right'
        // movement transition
        if(keyLEFT.isDown || keyRIGHT.isDown) {
            this.stateMachine.transition('moveBike')
        }

       // slash up or down
        if (keyARDOWN.isDown && bike.bikeSlash) {
            bike.direction = 'down'
            this.stateMachine.transition('slash')
        }
        if (keyARUP.isDown && bike.bikeSlash) {
            bike.direction = 'up'
            this.stateMachine.transition('slash')
        }

        // detection if death & transition to death
        if (bike.hp <= 0) {
            this.stateMachine.transition('deathBike')
        }

        if (!scene.statusCycle) this.stateMachine.transition('inactiveBike')

    }
}

// move is when player is non idle or has an input
// cases: 
//          player is on the ground
class MoveBikeState extends State {
    // executes every call/frame
    execute(scene, bike) {
        let playerVector = new Phaser.Math.Vector2(0, 0)
        console.log('bike move')
        
        
        if(keyLEFT.isDown) {
            playerVector.x = -1
            bike.direction = 'left'
        } else if(keyRIGHT.isDown) {
            playerVector.x = 1
            bike.direction = 'right'
        }

        if(keyUP.isDown) {
            playerVector.y = -1
            bike.direction = 'up'
        } else if(keyDOWN.isDown) {
            playerVector.y = 1
            bike.direction = 'down'
        }

        playerVector.normalize()

        bike.setAcceleration(bike.accelX * playerVector.x, bike.accelY * playerVector.y)
        //bike.anims.play(`move-${bike.direction}`)

        // check if the player is static relative to body
        if (bike.body.accelerationX == 0) this.stateMachine.transition('idleBike')

        // slash up or down
        if (keyARDOWN.isDown && bike.bikeSlash) {
            bike.direction = 'down'
            this.stateMachine.transition('slash')
        }
        if (keyARUP.isDown && bike.bikeSlash) {
            bike.direction = 'up'
            this.stateMachine.transition('slash')
        }

        // detection if death & transition to death
        if (bike.hp <= 0) {
            this.stateMachine.transition('deathBike')
        }

        if (!scene.statusCycle) this.stateMachine.transition('inactiveBike')
    }
}

// stab: player stabs the ground, can't move for a split second until animation
class SlashState extends State {
    enter(scene, bike) {
        bike.setAcceleration(0,0)
        bike.bikeSlash = false
        bike.anims.play(`slash-${bike.direction}`)

        // delayed damage for more effect
        scene.time.delayedCall(200, () => {
            // damage hitbox
            bike.slashHitbox.x = bike.x + bike.hitboxX
            bike.slashHitbox.y = bike.y + ((bike.direction == 'up') ? bike.hitboxUpY : bike.hitboxDownY)

            bike.slashHitbox.body.enable = true
            
        })

        bike.once('animationcomplete', () => {
            // check collision when animation is stab-down
            // create semi hitbox?
            bike.anims.play(`riding-bike`)
            // cooldown
            scene.time.delayedCall(600, () => {
                bike.bikeSlash = true
                bike.slashHitbox.body.enable = false
            })


            this.stateMachine.transition('idleBike')
        })
    }
}

// death: hp is 0, and player is killed
class DeathBikeState extends State {
    // executes every call/frame
    execute(scene, bike) {
        console.log('death')
        // clear tint if we have one
        console.log("Death")
        scene.scene.restart()
        // delete (wip)
        this.stateMachine.transition('idleBike')
    }
}