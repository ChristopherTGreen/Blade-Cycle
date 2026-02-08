class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }

    preload() {
        // load the visuals
        this.load.path = './assets/'

        // load assets
        this.load.image('bike', 'nonstatic/Bike.png')
        this.load.image('highway-road', 'static/HighwayRoad.png')
        this.load.image('highway-wall', 'static/HighwayWall.png')
        this.load.image('title', 'static/Title.png')
        this.load.spritesheet('character', 'nonstatic/Character.png', {
            frameWidth: 64,
            frameHeight: 64
        })
        this.load.spritesheet('bike-character', 'nonstatic/BikeCharacter.png', {
            frameWidth: 64,
            frameHeight: 64
        })
        this.load.spritesheet('bike-slash-up', 'nonstatic/BikeCharacterSlashUp-Sheet.png', {
            frameWidth: 64,
            frameHeight: 64
        })
        this.load.spritesheet('bike-slash-down', 'nonstatic/BikeCharacterSlashDown-Sheet.png', {
            frameWidth: 64,
            frameHeight: 64
        })
        this.load.spritesheet('character-stab', 'nonstatic/CharacterStab-Sheet.png', {
            frameWidth: 64,
            frameHeight: 64
        })
        // background assets
        this.load.image('background-stars', 'static/BackgroundStars.png')
        this.load.image('background-city', 'static/BackgroundCity.png')
        this.load.image('background-earth', 'static/BackgroundEarth.png')



        // load enemy assets
        this.load.spritesheet('hover-guard', 'nonstatic/HoverGuard.png', {
            frameWidth: 64
        })
        this.load.image('soldier-bike', 'nonstatic/SoldierBike.png')
        this.load.spritesheet('bullet', 'nonstatic/Bullet-Sheet.png', {
            frameWidth: 32,
            frameHeight: 32
        })
        
        
    }

    create() {
        // animations
        this.anims.create({
            key: 'flying',
            frames: this.anims.generateFrameNumbers('bullet', {
                start: 0,
                end: 3
            }),
            framerate:4,
            repeat: -1
        })
        this.anims.create({
            key: 'empty-bike',
            frames: this.anims.generateFrameNumbers('bike-character', {
                start: 1,
                end: 1
            }),
            framerate:0,
            repeat: 0
        })
        this.anims.create({
            key: 'riding-bike',
            frames: this.anims.generateFrameNumbers('bike-character', {
                start: 0,
                end: 0
            }),
            framerate:0,
            repeat: 0
        })
        this.anims.create({
            key: 'move-jumpright',
            frames: this.anims.generateFrameNumbers('character', {
                start: 0,
                end: 0
            }),
            framerate:0,
            repeat: 0
        })
        this.anims.create({
            key: 'move-jumpleft',
            frames: this.anims.generateFrameNumbers('character', {
                start: 0,
                end: 0
            }),
            framerate:0,
            repeat: 0
        })
        this.anims.create({
            key: 'idle-right',
            frames: this.anims.generateFrameNumbers('character', {
                start: 0,
                end: 0
            }),
            framerate:0,
            repeat: 0
        })
        this.anims.create({
            key: 'idle-left',
            frames: this.anims.generateFrameNumbers('character', {
                start: 0,
                end: 0
            }),
            framerate:0,
            repeat: 0
        })
        this.anims.create({
            key: 'move-right',
            frames: this.anims.generateFrameNumbers('character', {
                start: 0,
                end: 0
            }),
            framerate:0,
            repeat: 0
        })
        this.anims.create({
            key: 'move-left',
            frames: this.anims.generateFrameNumbers('character', {
                start: 0,
                end: 0
            }),
            framerate:0,
            repeat: 0
        })


        // attack anims
        this.anims.create({
            key: 'slash-up',
            frames: this.anims.generateFrameNumbers('bike-slash-up', {
                start: 0,
                end: 9
            }),
            framerate: 0.5,
            repeat: 0
        })
        this.anims.create({
            key: 'slash-down',
            frames: this.anims.generateFrameNumbers('bike-slash-down', {
                start: 0,
                end: 9
            }),
            framerate: 0.5,
            repeat: 0
        })
        this.anims.create({
            key: 'stab-down',
            frames: this.anims.generateFrameNumbers('character-stab', {
                start: 0,
                end: 11
            }),
            framerate: 0.25,
            repeat: 0
        })





        // place tile sprites
        this.roadTop = this.game.config.height - 200 // subtract this by pixel height for the wall loocation
        this.wallSize = 32

        this.backgroundStars = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background-stars').setOrigin(0, 0)
        this.backgroundEarth = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background-earth').setOrigin(0, 0)
        this.backgroundCity = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background-city').setOrigin(0, 0)
       
        this.highwayRoad = this.add.tileSprite(0, this.roadTop, this.game.config.width, 200, 'highway-road').setOrigin(0, 0)
        this.highwayWall = this.add.tileSprite(0, this.roadTop - this.wallSize, this.game.config.width, this.wallSize, 'highway-wall').setOrigin(0, 0)
        
        this.physics.add.image(this.game.config.width/2, this.game.config.height/2, 'title')

        
        this.temp_bike = this.physics.add.image(0, game.config.height/2 + game.config.height/4, 'bike-character', 0)
        this.time.delayedCall(4000, () => {
            this.scene.start('highwayScene')
        })
    }

    update() {
        this.temp_bike.x += 0.7
    }
}