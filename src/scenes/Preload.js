class Preload extends Phaser.Scene {
    constructor() {
        super("preloadScene")
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
        this.load.spritesheet('indication-of-bullet', 'nonstatic/IndicationOfAttack-Sheet.png', {
            frameWidth: 32,
            frameHeight: 32
        })

        // load interactive actions
        this.load.spritesheet('start-button', 'static/Button-Sheet.png', {
            frameWidth: 192,
            frameHeight: 48
        })
        this.load.spritesheet('small-button', 'static/SmallButton-Sheet.png', {
            frameWidth: 96,
            frameHeight: 48
        })
        this.load.spritesheet('volume-button', 'static/Volume-Sheet.png', {
            frameWidth: 32,
            frameHeight: 32
        })
        this.load.spritesheet('game-over-button', 'static/GameOver-Sheet.png', {
            frameWidth: 192,
            frameHeight: 48
        })


        
        // load font
        this.load.font('bladeFont', 'fonts/ABBERANCY.woff2')

        // load audio
        this.load.path = './assets/audio/'
        this.load.audio('stab-sound', 'SoundEffects/stab.wav')
        this.load.audio('bike-drive-sound', 'SoundEffects/drive.wav')
        this.load.audio('death-sound', 'SoundEffects/death2.wav')
        this.load.audio('slash-sound', 'SoundEffects/slash.wav')
        this.load.audio('alarm-sound', 'SoundEffects/alarm.wav')
        this.load.audio('fire-sound', 'SoundEffects/fire.wav')
        this.load.audio('jump-sound', 'SoundEffects/jump.wav')
        this.load.audio('hit-sound', 'SoundEffects/hit.wav')
        this.load.audio('wave-sound', 'SoundEffects/wave.wav')

        // load music
        this.load.audio('music', 'Music/blade-cycle.mp3')
    }

    create() {
        this.scene.start('menuScene')
    }
}