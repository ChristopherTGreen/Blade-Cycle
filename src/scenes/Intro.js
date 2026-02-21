class Intro extends Phaser.Scene {
    constructor() {
        super("introScene")
    }
 
    create() {   // place tile sprites
        this.roadTop = this.game.config.height - 200 // subtract this by pixel height for the wall loocation
        this.wallSize = 32

        this.backgroundStars = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background-stars').setOrigin(0, 0)
        this.backgroundEarth = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background-earth').setOrigin(0, 0)
        this.backgroundCity = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background-city').setOrigin(0, 0)
       
        this.highwayRoad = this.add.tileSprite(0, this.roadTop, this.game.config.width, 200, 'highway-road').setOrigin(0, 0)
        this.highwayWall = this.add.tileSprite(0, this.roadTop - this.wallSize, this.game.config.width, this.wallSize, 'highway-wall').setOrigin(0, 0)
        
        this.title = this.physics.add.image(this.game.config.width/2, this.game.config.height/4, 'title')

        
        this.temp_bike = this.physics.add.image(0, game.config.height/2 + game.config.height/4, 'bike-character', 1)
        
        this.sound.play('alarm-sound', {
            volume: game.settings.volume,
            loop: true,
            pan: -1
        })
        this.time.delayedCall(5000, () => {
            this.sound.stopAll('alarm-sound')
            this.scene.start('highwayScene')
        })
    }

    update() {
        this.temp_bike.setVelocityX(200)
        this.backgroundStars.tilePositionX += 0.04
        this.title.setVelocityX(200)
    }
}