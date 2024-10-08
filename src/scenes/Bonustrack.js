class Bonustrack extends Phaser.Scene {
    constructor() {
        super("Bonustrack");
        this.jugador = null;
        this.grupoEstrellas = null;
        this.cursors = null;
        this.puntaje = 0;
        this.puntajeMaximo = 0;
        this.textoPuntaje = 0;
    }
    /** Carga de Recursos */
    preload() {
        this.load.image('background', '/public/resources/img/background2.jpg');
        this.load.spritesheet('estrella', '/public/resources/img/estrella.png', { frameWidth: 130, frameHeight: 132 });
        this.load.spritesheet('supernave', '/public/resources/img/supernave2.png', { frameWidth: 45, frameHeight: 107.5 });
    }

    init(data) {
        this.puntaje = data.puntaje; //Recibe el puntaje
        this.puntajeMaximo = data.puntajeMaximo || 0;
        this.posicionNave = data.posicionNave; // Obtener posición de la nave
    }

    /** Creacion de objetos en el juego */
    create() {
        this.background = this.add.tileSprite(663, 298, 1326, 596, 'background');
        this.jugador = this.physics.add.sprite(this.posicionNave.x, this.posicionNave.y, 'supernave');

        //Animacion Nave
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('supernave', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0
        })
        this.anims.create({
            key: 'derecha',
            frames: this.anims.generateFrameNumbers('supernave', { start: 1, end: 3 }),
            frameRate: 10,
            repeat: 0
        })
        this.anims.create({
            key: 'izquierda',
            frames: this.anims.generateFrameNumbers('supernave', { start: 5, end: 7 }),
            frameRate: 10,
            repeat: 0
        })
        //Animacion Estrellas
        this.anims.create({
            key: 'estrellas',
            frames: this.anims.generateFrameNumbers('estrella', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        })

        this.jugador.setCollideWorldBounds(true); //Evita que salga de la pantalla

        this.grupoEstrellas = this.physics.add.group();
        this.time.addEvent({ delay: 500, callback: this.generarEstrellas, callbackScope: this, loop: true });

        this.cursors = this.input.keyboard.createCursorKeys(); //Configurando los controles
        
        this.physics.add.collider(this.jugador, this.grupoEstrellas, this.ganarPuntos, null, this); //Colisiones

        this.mensaje = this.add.text(663, 150, 'Bonustrack', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5); //Mensaje
        
        this.time.delayedCall(2000, () => { //Eliminar el mensaje después de 2 segundos
            this.mensaje.destroy();
        });

        this.textoPuntaje = this.add.text(18, 18, 'Puntaje: 0', { fontSize: '32px', fill: '#fff' });
    }
    /** Actualizacion del juego */
    update() {
        this.background.tilePositionY -= 2; //Ajusta la velocidad de desplazamiento del fondo
        this.jugador.setVelocityX(0); //Detiene la nave cuando va de manera Horizontal
        this.jugador.setVelocityY(0); //Detiene la nave cuando va de manera Vertical

        if (this.cursors.left.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('a'))) {
            this.jugador.setVelocityX(-300); //Mover a la izquierda
            this.jugador.anims.play('izquierda', true);

        } else if (this.cursors.right.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('d'))) {

            this.jugador.setVelocityX(300); //Mover a la derecha
            this.jugador.anims.play('derecha', true);
        } else {
            this.jugador.anims.play('idle', true);
        }

        if (this.cursors.up.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('w'))) {
            this.jugador.setVelocityY(-300); //Mover hacia arriba
        } else if (this.cursors.down.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('s'))) {
            this.jugador.setVelocityY(300); //Mover hacia abajo
        }

        this.puntaje += 1; //Incrementar el puntaje a medida que la nave avanza
        this.textoPuntaje.setText('Puntaje: ' + this.puntaje);

        if (this.puntaje >= 3000) { //puntaje para que pase a la siguiente escena
            const posicionNave = { x: this.jugador.x, y: this.jugador.y }; //Guarda posición

            let sonido = this.sound.add('sonido'); //Musica
            
            sonido.play({ //Reproducir la música en loop
                volume: 0.5
            });
            this.scene.start('Escena3', { puntaje: this.puntaje, puntajeMaximo: this.puntajeMaximo, posicionNave });
        }
    }
    /** Metodo para la generacion de meteoritos */
    generarEstrellas() {
        const x = Phaser.Math.Between(0, 1326); //posicion aleatoria en el eje x
        const estrella = this.grupoEstrellas.create(x, 0, 'estrella'); //Crear la estrella
        estrella.play('estrellas'); //Animacion Estrella
        estrella.setScale(0.5); 
        estrella.setVelocityY(200); //Velocidad vertical hacia abajo
    }

    ganarPuntos(jugador, estrella) {
        estrella.destroy();
    
        const incrementoPuntaje = 50;
        this.puntaje += incrementoPuntaje; //Aumenta el puntaje total
    
        //Mostrar mensaje
        this.extra = this.add.text(estrella.x, estrella.y, `+${incrementoPuntaje}`, { fontSize: '26px', fill: '#fff' }).setOrigin(0.5);
    
        //Desvanecer gradualmente el texto
        this.tweens.add({
            targets: this.extra,
            alpha: 0, //Desvanece el texto
            duration: 500, //Tiempo del desvanecimiento
            onComplete: () => {
                this.extra.destroy(); //Destruye el texto 
            }
        });
    
        this.textoPuntaje.setText('Puntaje: ' + this.puntaje);
    }    
} 

export default Bonustrack;