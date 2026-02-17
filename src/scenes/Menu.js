class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }

    preload() {
        // animations enemies
        this.anims.create({
            key: 'flying',
            frames: this.anims.generateFrameNumbers('bullet', {
                start: 0,
                end: 3
            }),
            framerate: 4,
            repeat: -1
        })
        this.anims.create({
            key: 'indication',
            frames: this.anims.generateFrameNumbers('indication-of-bullet', {
                start: 0,
                end: 5
            }),
            duration: 1000,
            framerate: 1,
            repeat: 0
        })

        // animations player
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
                frames: [0,1,2,3,4,5,6,7,8,8,9,9,10,10,11,11]
            }),
            framerate: 0.25,
            repeat: 0
        })
    }

    create() {

        // place tile sprites
        this.roadTop = this.game.config.height - 200 // subtract this by pixel height for the wall loocation
        this.wallSize = 32

        this.backgroundStars = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background-stars').setOrigin(0, 0)
        this.backgroundEarth = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background-earth').setOrigin(0, 0)
        this.backgroundCity = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background-city').setOrigin(0, 0)
       
        this.highwayRoad = this.add.tileSprite(0, this.roadTop, this.game.config.width, 200, 'highway-road').setOrigin(0, 0)
        this.highwayWall = this.add.tileSprite(0, this.roadTop - this.wallSize, this.game.config.width, this.wallSize, 'highway-wall').setOrigin(0, 0)
        
        this.title = this.physics.add.image(this.game.config.width/2, this.game.config.height/4, 'title')


        // containers for play and volume
        const button = this.add.image(game.config.width/2, game.config.height/4 * 3, 'start-button', 0)
        
        //const container = this.add.container(0, 0, button)

        button.setInteractive()
        
        button.once('pointerup', () => {
            button.setFrame(1)
            this.time.delayedCall(1000, () => {
                this.sound.stopAll()
                this.scene.start('introScene')
            })
        })

        // settings
        // display
        let fontConfig = {
            fontFamily: 'bladeFont', 
            fontSize: '20px',
            backgroundColor: '#a4b9c700',
            color: '#49fff5',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 400
        }
        // display container properties
        const distFromY = 60
        const distFromX = 30

        // volume settings
        const volumeInc = this.add.image(distFromX, game.config.height/2 - distFromY, 'volume-button', 0)
        const volumeDec = this.add.image(distFromX, game.config.height/2 + distFromY, 'volume-button', 2)
        const volumeBg = this.add.image(0, 0, 'small-button', 0).setOrigin(0.5, 0.5)
        const volumeTitle = this.add.text(-6, -10, `Volume:`, fontConfig).setOrigin(0.5, 0.5)
        this.volumeText = this.add.text(-6, 10, this.game.settings.volume*10, fontConfig).setOrigin(0.5, 0.5)
        const volumeGroup = this.add.group([ volumeInc, volumeDec, volumeBg, volumeTitle, this.volumeText ])
        
        const volumeContain = this.add.container(distFromX + volumeBg.width/4, game.config.height/2, [ volumeBg, volumeTitle, this.volumeText ])
        volumeInc.setInteractive()
        volumeDec.setInteractive()

        volumeInc.on('pointerup', () => {
            if (this.game.settings.volume < 1){
                volumeInc.setFrame(1)
                this.game.settings.volume += 0.1
                this.time.delayedCall(500, () => {
                    volumeInc.setFrame(0)
                    console.log(this.game.settings.volume)
                    this.volumeText.setText(this.game.settings.volume*10)
                })
            }
        })

        volumeDec.on('pointerup', () => {
            if (this.game.settings.volume > 0) {
                volumeDec.setFrame(3)
                this.game.settings.volume -= 0.1
                this.time.delayedCall(500, () => {
                    volumeDec.setFrame(2)
                    console.log(this.game.settings.volume)
                    this.volumeText.setText(this.game.settings.volume*10)
                })
            }
        })

        // music settings
        const musicInc = this.add.image(game.config.width - distFromX, game.config.height/2 - distFromY, 'volume-button', 0)
        const musicDec = this.add.image(game.config.width - distFromX, game.config.height/2 + distFromY, 'volume-button', 2)
        const musicBg = this.add.image(0, 0, 'small-button', 0).setOrigin(0.5, 0.5)
        const musicTitle = this.add.text(-6, -10, `Music:`, fontConfig).setOrigin(0.5, 0.5)
        this.musicText = this.add.text(-6, 10, this.game.settings.music*10, fontConfig).setOrigin(0.5, 0.5)
        const musicGroup = this.add.group([ musicInc, musicDec, musicBg, musicTitle, this.musicText ])

        const musicContain = this.add.container(game.config.width - distFromX - volumeBg.width/4, game.config.height/2, [ musicBg, musicTitle, this.musicText ])
        musicInc.setInteractive()
        musicDec.setInteractive()

        musicInc.on('pointerup', () => {
            if (this.game.settings.music < 1){
                musicInc.setFrame(1)
                this.game.settings.music += 0.1
                this.time.delayedCall(200, () => {
                    musicInc.setFrame(0)
                    console.log(this.game.settings.music)
                    this.musicText.setText(Math.floor(this.game.settings.music*10))
                })
            }
        })

        musicDec.on('pointerup', () => {
            if (this.game.settings.music > 0) {
                musicDec.setFrame(3)
                this.game.settings.music -= 0.1
                this.time.delayedCall(200, () => {
                    musicDec.setFrame(2)
                    console.log(this.game.settings.music)
                    this.musicText.setText(Math.floor(this.game.settings.music*10))
                })
            }
        })

        // highscore
        this.highScoreText = this.add.text(game.config.width/2 - 10, game.config.height/1.1, `Highscore: ${this.game.settings.highScore}`, fontConfig).setOrigin(0.5, 0.5)
        
        // assign UI groups for quick disable
        this.UI = this.add.group([ this.title, this.highScoreText, button ])
        this.allUI = this.add.group([ this.UI, volumeGroup, musicGroup ])
        this.allUI.addMultiple(this.UI.getChildren())
        this.allUI.addMultiple(volumeGroup.getChildren())
        this.allUI.addMultiple(musicGroup.getChildren())

        this.interactiveUI = this.add.group([button, volumeInc, volumeDec, musicInc, musicDec ])


        // extra config
        let extraConfig = {
            fontFamily: 'bladeFont', 
            fontSize: '32px',
            backgroundColor: '#a4b9c700',
            color: '#45eae2',
            wordWrap: { width: this.game.config.width-100, useAdvancedWrap: true},
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            lineSpacing: 1,
            fixedWidth: this.game.config.width
        }

        // credits
        const credits =
        "Code, Art, Music, and Sound were\n" +
        "Developed by Christopher Green\n" +
        "Abberancy Font by Raymond Larabie under PD"
        this.creditsText = this.add.text(0, 50, credits, extraConfig).setVisible(false).setStroke('#7796a9', 4)
        const creditsButton = this.add.image(0, game.config.height - distFromY/2, 'small-button', 0).setInteractive()
        creditsButton.x = game.config.width - distFromX - creditsButton.width/4
        const creditsTitle = this.add.text(creditsButton.x-5, creditsButton.y, `Credits`, fontConfig).setOrigin(0.5, 0.5)
        let creditsToggle = false

        // instructions/guide
        const guide =
        "Bike:\n" +
        "- WASD keys to Move\n" +
        "- Up & Down Arrows to Slash\n" +
        "- Spacebar to Jump/Transition to Player\n" +
        "Player: (After jumping/unseated)\n" +
        "- ASD keys to Move\n" +
        "- Down Arrow to Stab\n" +
        "- Spacebar to Jump\n" +
        "- Fall to get back on Bike\n" + 
        "Warning: Can only stab as Player while on-top of Hoverguard"
        this.guideText = this.add.text(100, 0, guide, extraConfig).setVisible(false).setAlign('left').setStroke('#7796a9', 4)
        const guideButton = this.add.image(0, game.config.height - distFromY/2, 'small-button', 0).setInteractive()
        guideButton.x = distFromX + guideButton.width/4
        const guideTitle = this.add.text(guideButton.x-8, guideButton.y, `Guide`, fontConfig).setOrigin(0.5, 0.5)
        let guideToggle = false


        // code for both after initialization

        creditsButton.on('pointerup', () => {
            creditsButton.setFrame(1)
            creditsToggle = !creditsToggle
            this.creditsText.setVisible(creditsToggle)
            this.allUI.getChildren().forEach(obj => {
                obj.setVisible(!creditsToggle)
            })

            this.interactiveUI.getChildren().forEach(ui => {
                ui.setInteractive(!creditsToggle)
            })

            // disable the other button
            guideButton.setVisible(!creditsToggle)
            guideTitle.setVisible(!creditsToggle)
            guideButton.setInteractive(!creditsToggle)

            this.time.delayedCall(200, () => {
                creditsButton.setFrame(0)
            })
        })
        
        guideButton.on('pointerup', () => {
            guideButton.setFrame(1)
            guideToggle = !guideToggle
            this.guideText.setVisible(guideToggle)
            this.allUI.getChildren().forEach(obj => {
                obj.setVisible(!guideToggle)
            })

            this.interactiveUI.getChildren().forEach(ui => {
                ui.setInteractive(!guideToggle)
            })

            // disable the other button
            creditsButton.setVisible(!guideToggle)
            creditsTitle.setVisible(!guideToggle)
            creditsButton.setInteractive(!guideToggle)

            this.time.delayedCall(200, () => {
                guideButton.setFrame(0)
            })
        })
    }

    update() {
        this.backgroundStars.tilePositionX += 0.04
    }
}