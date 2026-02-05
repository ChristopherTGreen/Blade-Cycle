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
        this.load.image('character', 'nonstatic/Character.png')
        this.load.image('platform', 'nonstatic/FlyingPlatform.png')
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
            }),
            framerate:0,
            repeat: 0
        })
        this.anims.create({
            key: 'riding-bike',
            frames: this.anims.generateFrameNumbers('bike-character', {
                start: 0
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
            framerate: 1,
            repeat: 0
        })
        this.anims.create({
            key: 'slash-down',
            frames: this.anims.generateFrameNumbers('bike-slash-down', {
                start: 0,
                end: 9
            }),
            framerate: 1,
            repeat: 0
        })



        this.scene.start('highwayScene')
    }

    update() {
        
    }
}