class Highway extends Phaser.Scene {
    constructor() {
        super('highwayScene')
    }

    preload() {

    }

    create() {
        // variables for gameplay
        // determines if player is in motercycle phase or air phase
        this.statusCycle = true
        this.roadTop = this.game.config.height - 200 // subtract this by pixel height for the wall loocation
        this.wallSize = 32
        this.customDepth = 50
        this.enemyCount = 2

        // background offset (for camera shakes)
        this.cameras.main.setZoom(1, 1)
        const camOffX = 10
        const camOffY = 10
        const camRoadOffX = 10
        const camRoadOffY = 10

        // place background
        this.backgroundStars = this.add.tileSprite(-camOffX, -camOffY, this.game.config.width + camOffX*2, this.roadTop + camOffY*2, 'background-stars').setOrigin(0, 0).setScrollFactor(0.1, 1)
        this.backgroundEarth = this.add.tileSprite(-camOffX, 0, this.game.config.width + camOffX*2, this.roadTop, 'background-earth').setOrigin(0, 0).setScrollFactor(0.1, 1)
        this.backgroundCity = this.add.tileSprite(-camOffX, 0, this.game.config.width + camOffX*2, this.roadTop, 'background-city').setOrigin(0, 0).setScrollFactor(0.1, 1)
       
        // place tile sprites
        this.highwayRoad = this.add.tileSprite(-camRoadOffX, this.roadTop, this.game.config.width + camOffX*2, 200, 'highway-road').setOrigin(0, 0)
        this.highwayWall = this.add.tileSprite(-camRoadOffX, this.roadTop - this.wallSize, this.game.config.width + camOffX*2, this.wallSize, 'highway-wall').setOrigin(0, 0)
        this.physics.add.existing(this.highwayWall, true)

        // create bullet group
        this.bullets = this.physics.add.group({
            classType: Bullet,
            immovable: true,
            runChildUpdate: true
        })
        

        // add bike sprite
        this.bike = new Bike(this, game.config.width/2, game.config.height/2 + game.config.height/4, 'bike-character', 'right')
        // set initial bike bounds
        this.bike.body.setCollideWorldBounds(true)

        // add player sprite (transparent, but constantly on the bike until jumping off)
        this.player = new Player(this, game.config.width/2, game.config.height/2 + game.config.height/4, 'character')

        // create enemies
        // soldier enemies
        this.maxVsoldierX = 100.0
        this.maxVsoldierY = 50.0
        this.soldiers = this.physics.add.group({
            classType: SoldierBike,
            dragX: 60.0,
            dragY: 20.0,
            friction: 0.0,
            maxVelocityX: this.maxVsoldierX,
            maxVelocityY: this.maxVsoldierY,
            collideWorldBounds: false,
            runChildUpdate: true
        })
        this.createSoldierBike(this, -200, this.roadTop + 100)


        // hoverguard enemies
        this.maxVguardX = 100.0
        this.maxVguardY = 50.0
        this.guards = this.physics.add.group({
            classType: HoverGuard,
            dragX: 100.0,
            dragY: 50.0,
            frictionX: 1.0,
            maxVelocityX: this.maxVguardX,
            maxVelocityY: this.maxVguardY,
            runChildUpdate: true
        })
        this.createHoverGuard(this, 100, 200)

        


        // collisions
        this.physics.add.collider(this.bike, this.highwayWall)
        this.physics.add.collider(this.player, this.guards, this.stopMovementCallback, this.collisionProcessCallback, this)
        this.physics.add.collider(this.bike, this.soldiers)
        this.physics.add.collider(this.soldiers, this.highwayWall)
        this.physics.add.collider(this.soldiers, this.soldiers)
        this.physics.add.collider(this.guards, this.guards)


        // key controls
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        keyARDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        keyARUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    }

    update() {
        // status cycle (either player controlled or cycle)
        this.bikeFSM.step()
        this.playerFSM.step()
        this.bike.setDepth(this.customDepth + this.bike.y)
        this.player.setDepth(this.customDepth + this.player.y)


        this.highwayRoad.tilePositionX += 6
        this.highwayWall.tilePositionX += 6
        this.backgroundStars.tilePositionX += 0.04
        this.backgroundEarth.tilePositionX += 0.06
        this.backgroundCity.tilePositionX += 0.08

        this.callHoverGuardAI()
        this.callSoldierBikeAI()

        if (this.soldiers.countActive() === 0 && this.guards.countActive() === 0) {
            this.resetEnemies()
        }
        
    }

    // if enemies are out, create new ones
    resetEnemies() {
        this.enemyCount += 2
        for (let i = 0; i < this.enemyCount / 2; i++) {
            this.createSoldierBike(this, Phaser.Math.Between(-300, -64),  Phaser.Math.Between(this.roadTop, this.game.config.height))
        }
        for (let i = 0; i < this.enemyCount / 2; i++) {
            this.createHoverGuard(this, Phaser.Math.Between(-200, -100),  Phaser.Math.Between(0, this.roadTop))

        }
        
    }

    // bullet call
    // optional: transition will bring the state machine into new state
    fireCall(source, target) {
        const bullet = this.bullets.get()
        bullet.enableBody(true, true)

        bullet.firingSource = source
        bullet.fireBullet(this, source, target)
    }

    // guard callbacks
    // collision check which resets status after
    // collision only works when going down and can be passed through
    collisionProcessCallback(obj1, obj2) {
        if(obj2.y - 10 > obj1.y && !keyDOWN.isDown) {
            obj2.body.setVelocity(0, 0)
            obj2.body.setAcceleration(0, 0)
            return true
        }
        obj2.body.setImmovable(false)
        return false
    }
    // collision will set the guard to zero velocity, and enables immovable
    stopMovementCallback(obj1, obj2) {
        obj2.body.setImmovable(true)
    }


    // hover guard functions
    // creates hover guard enemy
    createHoverGuard(scene, x, y) {
        this.hoverGuard = new HoverGuard(scene, x, y, 'hover-guard', 0, 'right', this.bike)
        
        this.guards.add(this.hoverGuard)

        // initial swing into the scene
        this.hoverGuard.setVelocityX(50)
    }

    // hoverguard ai, calls all children to chase the bike and reset depth
    callHoverGuardAI() {
        const guardList = this.guards.getChildren()
        guardList.forEach(guard => {
            if (guard && guard.active && guard.guardFSM) {
                guard.guardFSM.step()
                guard.setDepth(this.customDepth + guard.y + -30)
            }
        })
    }

    // soldier bike functions
    // creates soldier bike enemy
    createSoldierBike(scene, x, y) {
        this.soldierBike = new SoldierBike(scene, x, y, 'soldier-bike', 0, 'right', this.bike)

        this.soldiers.add(this.soldierBike)

        // initial swing into the scene
        this.soldierBike.setVelocityX(75)
    }

    // soldier bike ai, calls all children to chase the bike and reset depth
    callSoldierBikeAI() {
        const soldierList = this.soldiers.getChildren() // safer method than before
        soldierList.forEach(soldier => {
            if (soldier && soldier.active && soldier.soldierFSM) {
                soldier.soldierFSM.step()
                if (soldier.x > 50) soldier.body.setCollideWorldBounds(true)
                soldier.setDepth(this.customDepth + soldier.y)
            }
        })
    }

    // tweens for damage and after-damage hits
    // flashing red hit for damage (optional, dependings no webgl or canvas)
    damageHit(source, redTime, time){
        this.cameras.main.shake(200, 0.003)
        this.tweens.add({
            targets: source,
            tint: 0xff0000,
            alpha: 1.0,
            duration: redTime,
            yoyo: false,
            repeat: 0,
            onComplete: () => {
                source.alpha = 1
                source.clearTint()
                this.safeTimeHit(source, time)
            } 
        })
    }

    // flashing alpha for safe-time after being hit
    safeTimeHit(source, time){
        this.tweens.add({
            targets: source,
            alpha: 0.25,
            duration: time,
            yoyo: true,
            repeat: 10,
            onComplete: () => {
                source.alpha = 1
                source.recentHit = false
            }  
        })
    }

    // death/disappear effect
    deathAnim(source, time, destroy){
        this.tweens.add({
            targets: source,
            tint: 0xff0000,
            alpha: 0,
            duration: time,
            ease: 'Linear',
            onComplete: () => {
                this.cameras.main.shake(200, 0.004)
                if (destroy) this.time.delayedCall(10, () => {
                    source.setActive(false)
                    source.setVisible(false)
                    source.destroy()
                })
            }  
        })
    }
}