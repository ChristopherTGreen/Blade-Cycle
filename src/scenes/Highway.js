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
        this.enemyCount = 4

        // place background
        this.backgroundStars = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background-stars').setOrigin(0, 0)
        this.backgroundEarth = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background-earth').setOrigin(0, 0)
        this.backgroundCity = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background-city').setOrigin(0, 0)
       
        // place tile sprites
        this.highwayRoad = this.add.tileSprite(0, this.roadTop, this.game.config.width, 200, 'highway-road').setOrigin(0, 0)
        this.highwayWall = this.add.tileSprite(0, this.roadTop - this.wallSize, this.game.config.width, this.wallSize, 'highway-wall').setOrigin(0, 0)
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
        this.player = new PlayerTest(this, game.config.width/2, game.config.height/2 + game.config.height/4, 'character')


        // soldier enemies
        this.soldiers = this.physics.add.group({
            classType: SoldierBike,
            dragX: 20.0,
            dragY: 14.0,
            friction: 0.2,
            collideWorldBounds: true,
            runChildUpdate: true
        })
        this.createSoldierBike(this, 100, this.roadTop + 100)
        this.createSoldierBike(this, 200, this.roadTop + 200)


        // create enemies
        // hoverguard enemies
        this.guards = this.physics.add.group({
            classType: HoverGuard,
            immovable: true,
            dragX: 50.0,
            dragY: 50.0,
            frictionX: 1.0,
            runChildUpdate: true
        })
        this.createHoverGuard(this, 100, 100)
        this.createHoverGuard(this, 200, 200)

        


        // collisions
        this.physics.add.collider(this.bike, this.highwayWall)
        this.physics.add.collider(this.player, this.guards, null, this.collisionProcessCallback, this)
        this.physics.add.collider(this.bike, this.soldiers)
        this.physics.add.collider(this.soldiers, this.highwayWall)
        this.physics.add.collider(this.soldiers, this.soldiers)
        this.physics.add.collider(this.guards, this.guards)
        
        // overlap collisions
        this.playerHitbox = this.physics.add.overlap(this.player, this.bullets, (target, bullet) => {
            bullet.lifeTime = 0
            target.hp -= 25
            console.log('hit')
        })


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
            this.createSoldierBike(this, 0,  Phaser.Math.Between(this.roadTop, this.game.config.height))
        }
        for (let i = 0; i < this.enemyCount / 2; i++) {
            this.createHoverGuard(this, 0,  Phaser.Math.Between(0, this.roadTop))

        }
        
    }

    // bullet call
    fireCall(source, target) {
        const bullet = this.bullets.get()
        bullet.enableBody(true, true)
        bullet.fireBullet(this, source, target)
    }

    // collision only works down
    collisionProcessCallback(obj1, obj2) {
        if(obj1.y < obj2.y-10 && !keyDOWN.isDown) {
            return true
        }
        return false
    }

    // hover guard functions
    // creates hover guard enemy
    createHoverGuard(scene, x, y) {
        this.hoverGuard = new HoverGuard(scene, x, y, 'hover-guard', 0, 'right', this.bike)
        
        this.guards.add(this.hoverGuard)
    }

    // hoverguard ai, chases the bike
    callHoverGuardAI() {
        this.guards.children.iterate(guard => {
            if (guard && guard.active && guard.guardFSM) {
                guard.guardFSM.step()
                guard.setDepth(this.customDepth + guard.y)
            }
        })
    }

    // soldier bike functions
    // creates soldier bike enemy
    createSoldierBike(scene, x, y) {
        this.soldierBike = new SoldierBike(scene, x, y, 'soldier-bike', 0, 'right', this.bike)

        this.soldiers.add(this.soldierBike)
    }

    // soldier bike ai, chases the bike closely
    callSoldierBikeAI() {
        const soldierList = this.soldiers.getChildren() // safer method than before
        soldierList.forEach(soldier => {
            if (soldier && soldier.active && soldier.soldierFSM) {
                soldier.soldierFSM.step()
                soldier.setDepth(this.customDepth + soldier.y)
            }
        })
    }

    // tweens for damage and after-damage hits
    // flashing red hit for damage (optional, dependings no webgl or canvas)
    damageHit(source, redTime, time){
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
}