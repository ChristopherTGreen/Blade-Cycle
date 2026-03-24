// Christopher Green
// Blade Cycle
// 30-50 hours (probably most likely higher end)

"use strict"

let config = {
    type: Phaser.AUTO,
    width: 854,
    height: 480,
    parent: 'Blade Cycle',
    backgroundColor: '#000000',
    resolution: 1,
    scale: {
        zoom: 1,
        mode: Phaser.Scale.NONE,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,

    },
    render: {
        pixelArt: true,
        
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            debug: false,
        }
    },
    audio: {
        enableWebAudio: true
    },
    
    scene: [ Preload, Menu, Intro, Highway ]
}

let game = new Phaser.Game(config)

// reserve keyboard bindings (might change to cursors)
let keyLEFT, keyRIGHT, keyUP, keyDOWN, keyARDOWN, keyARUP, keySPACE

// initial settings
game.settings = {
    volume: 1,
    music: 1,
    highScore: 0
}