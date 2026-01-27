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
        // place tile sprites
        this.highwayRoad = this.add.tileSprite(0, this.game.config.height - 200, 720, 200, 'highway-road').setOrigin(0, 0)
        this.highwayWall = this.add.tileSprite(0, this.game.config.height - 232, 720, 32, 'highway-wall').setOrigin(0, 0)
        
        // add player sprite
        this.player = new Player(this, game.config.width/2, game.config.height/2, 'bike')
        this.player.body.setCollideWorldBounds(true)

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