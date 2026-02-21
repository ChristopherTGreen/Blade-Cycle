// Christopher Green
// Blade Cycle
// 30-50 hours (probably most likely higher end)
// Creative tilt:
// Point 1: The game uses state machines with a bike and player, to incorporate
// a swapping or switching mechanics, allowing players to ride the bike and quickly
// jump out to fight in the air. Technically speaking, I had to figure out on my own
// how to create enemies, in a group, all functional independently, that can and would
// chase the player. 
// Point 2: Visually, I am proud of the unique tech, industrial, and urban style. The 
// visuals were inspired from FF7 1997, Halo, and Warhammer, along with a game idea I've had
// since 2021. The tip of the tall building is on fire, which is a plot point in my world. 
// The background, (first time using asesprite) incorporates a unique effect of parralaxing and 
// a blue light which covers the background in a natural almost otherworldly manner. And for the
// music, I was inspired by FF7 1997, researching sound devices which were used during that time
// for VSTs, and analyizing the music, as well as incorporating motifs which came from my own
// music I've released in the past, such as Pursued by Dreadnoughts and Ambushed in the Nebulan
// Graveyards. 

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