// Initial code for Blade Cycle

"use strict"

let config = {
    type: Phaser.AUTO,
    width: 854,
    height: 480,
    parent: 'Blade Cycle',
    backgroundColor: '#ffffff',
    scale: {
        zoom: 1
        
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