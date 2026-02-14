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
        this.bikeCount = 2
        this.guardCount = 0
        this.waveCount = 1
        this.maxHp = 200
        this.givenHp = 200
        this.score = 0

        // background offset (for camera shakes)
        this.cameras.main.setZoom(1.0, 1.0)
        const camOffX = 10
        const camOffY = 10
        const camRoadOffX = 10
        const camRoadOffY = 10
        const extraLengthRoad = 300 // adds extra road in the back, helpful to prevent spawns outside of map

        // place background
        this.backgroundStars = this.add.tileSprite(-camOffX, -camOffY, this.game.config.width + camOffX*2, this.roadTop + camOffY*2, 'background-stars').setOrigin(0, 0).setScrollFactor(0.1, 1)
        this.backgroundEarth = this.add.tileSprite(-camOffX, 0, this.game.config.width + camOffX*2, this.roadTop, 'background-earth').setOrigin(0, 0).setScrollFactor(0.1, 1)
        this.backgroundCity = this.add.tileSprite(-camOffX, 0, this.game.config.width + camOffX*2, this.roadTop, 'background-city').setOrigin(0, 0).setScrollFactor(0.1, 1)
       
        // place tile sprites
        this.highwayRoad = this.add.tileSprite(-camRoadOffX, this.roadTop, this.game.config.width + camOffX*2, 200, 'highway-road').setOrigin(0, 0)
        this.highwayWall = this.add.tileSprite(-camRoadOffX - extraLengthRoad, this.roadTop - this.wallSize, this.game.config.width + camOffX*2 + extraLengthRoad, this.wallSize, 'highway-wall').setOrigin(0, 0)
        this.physics.add.existing(this.highwayWall, true)

        // create bullet group
        this.bullets = this.physics.add.group({
            classType: Bullet,
            immovable: true,
            runChildUpdate: true
        })
        

        // add bike sprite
        this.bike = new Bike(this, game.config.width/2, game.config.height/2 + game.config.height/4, 'bike-character', 0, 'right', this.givenHp)

        // add player sprite (transparent, but constantly on the bike until jumping off)
        this.player = new Player(this, game.config.width/2, game.config.height/2 + game.config.height/4, 'character', 0, 'right', this.givenHp)

        // create enemies
        // soldier enemies
        this.maxVsoldierX = 125.0
        this.maxVsoldierY = 75.0
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
        this.createSoldierBike(this, -200, this.roadTop + 50)
        this.createSoldierBike(this, -200, this.roadTop + 150)
      


        // hoverguard enemies
        this.maxVguardX = 125.0
        this.maxVguardY = 75.0
        this.guards = this.physics.add.group({
            classType: HoverGuard,
            dragX: 100.0,
            dragY: 50.0,
            frictionX: 1.0,
            maxVelocityX: this.maxVguardX,
            maxVelocityY: this.maxVguardY,
            runChildUpdate: true
        })
        

        // collisions
        this.physics.add.collider(this.bike, this.highwayWall)
        this.physics.add.collider(this.player, this.guards, this.stopMovementCallback, this.collisionProcessCallback, this)
        this.physics.add.collider(this.bike, this.soldiers)
        this.physics.add.collider(this.soldiers, this.highwayWall)
        this.physics.add.collider(this.soldiers, this.soldiers)
        this.physics.add.collider(this.guards, this.guards)

        // sound assignments (should move these to respective groups if i have time)
        this.soundDeath = this.sound.add('death-sound', {
            volume: game.settings.volume * 1.3
        })
        this.soundSlash = this.sound.add('slash-sound', {
            volume: game.settings.volume * 1.3
        })
        this.soundStab = this.sound.add('stab-sound', {
            volume: game.settings.volume * 1.3
        })

        // music
        const music = this.sound.add('music', {
            volume: game.settings.music * 0.9,
            loop: true
        })
        music.play()


        // key controls
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        keyARDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        keyARUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)

        // display
        let fontConfig = {
            fontFamily: 'bladeFont', 
            fontSize: '30px',
            backgroundColor: '#a4b9c700',
            color: '#49fff5',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 400
        }

        // wave text & hp
        this.waveText = this.add.text(10, 0, `Wave: ${this.waveCount}`, fontConfig).setScrollFactor(1, 1).setDepth(2000)
        this.healthText = this.add.text(10, this.game.config.height - 50, `Health: ${this.player.hp}`, fontConfig).setScrollFactor(1, 1).setDepth(2000)


        // button for restart
        this.restartButton = this.add.image(game.config.width/2, game.config.height/4 * 3, 'game-over-button', 0).setVisible(false).setDepth(2000)

        this.restartButton.setInteractive()
        this.restartButton.on('pointerup', () => {
            this.restartButton.setFrame(1)
            this.time.delayedCall(1000, () => {
                this.sound.stopAll()
                this.scene.restart()
            })
        })
        this.restartButton.disableInteractive()

        this.menuBg = this.add.image(0, 0, 'small-button', 0).setOrigin(0.5, 0.5).setDepth(2000)
        this.menuText = this.add.text(this.menuBg.width*1.58, 0, 'Menu', fontConfig).setOrigin(0.5, 0.5).setDepth(2100)
        
        this.menuContain = this.add.container(game.config.width/2, game.config.height/4 * 3.5, [ this.menuBg, this.menuText ]).setVisible(false).setDepth(2000)
        this.menuBg.setInteractive()

        this.menuBg.on('pointerup', () => {
            this.menuBg.setFrame(1)
            this.time.delayedCall(500, () => {
                this.sound.stopAll()
                this.menuBg.setFrame(0)
                this.scene.start('menuScene')
            })
        })
        this.menuBg.disableInteractive()

        // highscore
        this.highScoreText = this.add.text(game.config.width/2, 0, `Score: ${this.score}`, fontConfig).setScrollFactor(1,1).setDepth(2000)
        
        
    }

    update() {
        this.bikeFSM.step()
        this.playerFSM.step()
        if (this.player.hp > 0 && this.bike.hp > 0)  {
            this.bike.setDepth(this.customDepth + this.bike.y)
            this.player.setDepth(this.customDepth + this.player.y)
            this.callHoverGuardAI()
            this.callSoldierBikeAI()

            if (this.soldiers.countActive() === 0 && this.guards.countActive() === 0) {
                this.resetEnemies()
            }
        }

        this.highwayRoad.tilePositionX += 6
        this.highwayWall.tilePositionX += 6
        this.backgroundStars.tilePositionX += 0.04
        this.backgroundEarth.tilePositionX += 0.06
        this.backgroundCity.tilePositionX += 0.08
    }

    // wave transition, resets enemies and increases their count
    // only spawns additional hoverguards if count is 1.5 that of soldiers
    resetEnemies() {
        this.sound.play('wave-sound')
        this.waveCount += 1

        if (this.bikeCount < this.guardCount * 2) this.bikeCount += 1
        else this.guardCount += 1

        for (let i = 0; i < Math.floor(this.bikeCount); i++) {
            this.createSoldierBike(this, Phaser.Math.Between(-300, -100),  Phaser.Math.Between(this.roadTop+40, this.game.config.height))
        }
        for (let i = 0; i < Math.floor(this.guardCount); i++) {
            this.createHoverGuard(this, Phaser.Math.Between(-300, -100),  Phaser.Math.Between(0, this.roadTop))
        }

        this.waveText.setText(`Wave: ${Math.floor(this.waveCount)}`)

        // health heal
        const heal = 50

        if (this.bike.hp + heal >= this.maxHp || this.player.hp + heal >= this.maxHp) {
            this.bike.hp = this.maxHp
            this.player.hp = this.maxHp
        }
        else {
            this.bike.hp += heal
            this.player.hp += heal
        }
        this.healthText.setText(`Health: ${Math.floor(this.player.hp)}`)
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
        this.sound.play('hit-sound', {
            volume: game.settings.volume
        })
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
        this.soundDeath.play()
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

                    // if anyone dies, reset highscore
                    this.highScoreText.setText(`Score: ${Math.floor(this.score)}`)
                })
            }  
        })
    }
}