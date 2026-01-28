// Initial code for Blade Cycle

"use strict"

let config = {
    type: Phaser.AUTO,
    width: 720,
    height: 480,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 500
            },
            debug: true
        }
    },
    scene: [ Menu, Highway ]
}

let game = new Phaser.Game(config)

// reserve keyboard bindings (might change to cursors)
let keyLEFT, keyRIGHT, keyUP, keyDOWN, keySLASH, keySPACE

// might set UI sizes later