class Highway extends Phaser.Scene {
    constructor() {
        super('highwayScene')
    }

    preload() {
        // nothing yet
    }

    create() {
        // add player sprite
        this.player = new Player(this, game.config.width/2, game.config.height/2, 'character')
    }

    update() {
        // nothing yet
    }
}