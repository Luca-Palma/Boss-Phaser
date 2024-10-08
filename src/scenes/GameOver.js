class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }

    init(data) {
        this.puntaje = data.puntaje; //Recibir el puntaje
        this.puntajeMaximo = data.puntajeMaximo; //Recibe el puntaje maximo
    }


    preload(){
        this.load.image('backgroundGameOver', '/public/resources/img/backgroundGameOver.png');
    }
    

    create() {
        this.background = this.add.tileSprite(663, 298, 1326, 596, 'backgroundGameOver');
        this.add.text(663, 200, 'Game Over', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(663, 300, 'Puntaje: ' + this.puntaje, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(663,500, 'Puntaje Máximo:'+ this.puntajeMaximo, { fontSize: '32px', fill: '#fff'}).setOrigin(0.5);
        this.add.text(663, 400, 'Barra espaciadora para volver a jugar', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        this.sound.stopAll();

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Escena1', {puntajeMaximo: this.puntajeMaximo}); //Reiniciar el juego
        });
    }
}

export default GameOver; 