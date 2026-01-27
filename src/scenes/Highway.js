class Highway extends Phaser.Scene {
    constructor() {
        super('highwayScene')
    }

    preload() {
        // nothing yet
        this.load.image('character', './assets/nonstatic/CharacterBox.png')
        this.load.image('bike', './assets/nonstatic/Bike.png')
        this.load.image('highway-road', './assets/static/HighwayRoad.png')
        this.load.image('highway-wall', './assets/static/HighwayWall.png')
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
        

        // add player sprite
        this.player = new Player(this, game.config.width/2, game.config.height/2 + game.config.height/4, 'bike')
        // set initial player bounds
        this.player.body.setCollideWorldBounds(true)
        this.physics.world.bounds.top = this.roadTop - this.wallSize
        console.log(this.physics.world.bounds.top)

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    
    
    }

    update() {
        this.player.update()
        this.highwayRoad.tilePositionX += 5
        this.highwayWall.tilePositionX += 5
    }
}