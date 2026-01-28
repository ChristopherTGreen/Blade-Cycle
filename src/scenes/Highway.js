class Highway extends Phaser.Scene {
    constructor() {
        super('highwayScene')
    }

    preload() {
        // load assets
        this.load.image('bike', './assets/nonstatic/Bike.png')
        this.load.image('highway-road', './assets/static/HighwayRoad.png')
        this.load.image('highway-wall', './assets/static/HighwayWall.png')
        this.load.image('character', './assets/nonstatic/Character.png')
    }

    create() {
        // variables for gameplay
        // determines if player is in motercycle phase or air phase
        this.statusCycle = true
        this.roadTop = this.game.config.height - 200 // subtract this by pixel height for the wall loocation
        this.wallSize = 32

        // place tile sprites
        this.highwayRoad = this.add.tileSprite(0, this.roadTop, this.game.config.width, 200, 'highway-road').setOrigin(0, 0)
        this.highwayWall = this.add.tileSprite(0, this.roadTop - this.wallSize, this.game.config.width, this.wallSize, 'highway-wall').setOrigin(0, 0)
        this.physics.add.existing(this.highwayWall, true)

        // add bike sprite
        this.bike = new Bike(this, game.config.width/2, game.config.height/2 + game.config.height/4, 'bike')
        // set initial bike bounds
        this.bike.body.setCollideWorldBounds(true)

        // add player sprite (transparent, but constantly on the bike until jumping off)
        this.player = new Player(this, game.config.width/2, game.config.height/2 + game.config.height/4, 'character')
        this.player.body.setCollideWorldBounds(true)
        this.player.setAlpha(0.0)
        this.player.body.setAllowGravity(false)

        // collision limitation for bikes
        this.physics.add.collider(this.bike, this.highwayWall)

        // key controls
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    
    
    }

    update() {
        // status cycle (either player controlled or cycle)
        if (this.statusCycle) {
            this.bike.update()
            this.player.x = this.bike.x
            this.player.y = this.bike.y
            
        }
        else {
            this.player.update()
            // condition for getting back onto the motercycle
            if (this.player.y > (game.config.height/2 + game.config.height/4)) {
                this.bike.x = this.player.x
                this.bike.y = this.player.y

                
                this.statusCycle = true
                this.player.setAlpha(0.0)
                this.player.body.setAllowGravity(false)

                // call to the player to stop all acceleration/reset it
                this.player.seated()
            }
        }

        this.checkJump()

        this.highwayRoad.tilePositionX += 3
        this.highwayWall.tilePositionX += 3
    }

    // jump checker to make sure swapping goes well, and jumps after switching from cycle
    checkJump() {
        if(this.statusCycle && keySPACE.isDown) {
            this.statusCycle = false
            this.player.setAlpha(1.0)
            this.player.body.setAllowGravity(true)
            this.player.body.setVelocityY(-500)
            this.player.body.setVelocityX(this.bike.body.velocity.x)
            this.bike.unseated()
        }
    }
}