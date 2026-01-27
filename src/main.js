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
            debug: true
        }
    },
    scene: [ Highway ]
}

let game = new Phaser.Game(config)

// reserve keyboard bindings (might change to cursors)
let keyLeft, keyRight, keyUp, keyDown, keySlash

// might set UI sizes later