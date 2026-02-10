// Initial code for Blade Cycle

"use strict"

let config = {
    type: Phaser.AUTO,
    width: 854,
    height: 480,
    backgroundColor: '#FFFF66',
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
            debug: true,
            
        }
    },
    
    scene: [ Menu, Highway ]
}

let game = new Phaser.Game(config)

// reserve keyboard bindings (might change to cursors)
let keyLEFT, keyRIGHT, keyUP, keyDOWN, keyARDOWN, keyARUP, keySPACE

// might set UI sizes later