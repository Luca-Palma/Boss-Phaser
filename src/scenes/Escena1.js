class Escena1 extends Phaser.Scene {
    constructor() {
        super("Escena1");
        this.background = null;
        this.jugador = null;
        this.grupoMeteoros = null;
        this.cursors = null;
        this.puntaje = 0;
        this.puntajeMaximo=0;
        this.textoPuntaje = 0;
        this.cantidad = 300;    // Tiempo de generación inicial (milisegundos)
    }
    /** Carga de Recursos */
    preload() {
        this.load.image('background', '/public/resources/img/background2.jpg');// añado el fondo
        this.load.spritesheet('meteoro', '/public/resources/img/meteoro2.png', { frameWidth: 40, frameHeight: 55.5 });
        this.load.spritesheet('supernave', '/public/resources/img/supernave2.png', { frameWidth: 45, frameHeight: 107.5 });//width192 & height144
        this.load.audio('musica', '/public/resources/sounds/music.mp3');
        this.load.audio('sonido','/public/resources/sounds/sonido.mp3');
    }

    init(data) {
        this.puntajeMaximo = data.puntajeMaximo || 0; // Si viene de otra escena, usa ese puntaje
    }

    /** Creacion de objetos en el juego */
    create() {
        //this.add.image(400,300,'cielo'); 
        this.background = this.add.tileSprite(663, 298, 1326, 596, 'background'); // creo el fondo con tilesprite para que funcion el desplazamiento
        this.jugador = this.physics.add.sprite(663, 500, 'supernave'); //Creando la nave
        let music = this.sound.add('musica');  //añadir la música
        // Reproducir la música en loop
        music.play({
        loop: true,
        volume: 0.5 
    });

        //AnimAcion Spritesheet
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
        // animacion del meteoro
        this.anims.create({
            key: 'meteoro_cayendo',
            frames: this.anims.generateFrameNumbers('meteoro', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        })

        this.jugador.setCollideWorldBounds(true); //Evita que salga de la pantalla

        this.grupoMeteoros = this.physics.add.group(); //Creando el grupo de meteoritos
        this.time.addEvent({
            delay: this.cantidad,
            callback: () => {
                this.generarMeteoros(); // Genera los meteoros
                // Actualizar el evento para el próximo ciclo
                this.time.removeAllEvents(); // Eliminar el evento previo para no duplicar la generación
                this.time.addEvent({ delay: this.cantidad, callback: this.generarMeteoros, callbackScope: this, loop: true });

                // Muestra un mensaje
                this.mensaje = this.add.text(663, 150, 'Nivel 1', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

                // Eliminar el mensaje después de 2 segundos
                this.time.delayedCall(2000, () => {
                    this.mensaje.destroy(); // Elimina el mensaje
                });
            },
            callbackScope: this,
            loop: true
        });

        this.cursors = this.input.keyboard.createCursorKeys();//Configurando los controles
        // Colisiones
        this.physics.add.collider(this.jugador, this.grupoMeteoros, this.gameOver, null, this);

        this.puntaje = 0; //resetea el puntaje a 0 cuando se inicia la escena
        this.textoPuntaje = this.add.text(18, 18, 'Puntaje: 0', { fontSize: '32px', fill: '#fff' });

    }
    generarMeteoros() {
        const x = Phaser.Math.Between(0, 800); //posicion aleatoria en el eje x

        const meteoro = this.grupoMeteoros.create(x, 0, 'meteoro'); //Crear un meteorito

        meteoro.play('meteoro_cayendo'); // animacion del meteoro

        meteoro.setVelocityY(200); //Velocidad vertical hacia abajo

        this.textoPuntaje = this.add.text(18, 18, 'Puntaje: 0', { fontSize: '32px', fill: '#fff' });

    }
    /** Actualizacion del juego */
    update() {
        this.background.tilePositionY -= 2; // Ajusta la velocidad de desplazamiento del fondo
        this.jugador.setVelocityX(0); // Detiene la nave cuando va de manera Horizontal
        this.jugador.setVelocityY(0); // Detiene la nave cuando va de manera Vertical

        if (this.cursors.left.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('a'))) {
            this.jugador.setVelocityX(-300); // Mover a la izquierda
            this.jugador.anims.play('izquierda', true);

        } else if (this.cursors.right.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('d'))) {
            this.jugador.setVelocityX(300); // Mover a la derecha
            this.jugador.anims.play('derecha', true);

        } else {
            this.jugador.anims.play('idle', true);
        }

        if (this.cursors.up.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('w'))) {
            this.jugador.setVelocityY(-300); // Mover hacia arriba
        } else if (this.cursors.down.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('s'))) {
            this.jugador.setVelocityY(300); // Mover hacia abajo
        }

        this.puntaje += 1; // Incrementar el puntaje a medida que la nave avanza
        this.textoPuntaje.setText('Puntaje: ' + this.puntaje);

        if (this.puntaje >= 1000) { //puntaje para que pase a la siguiente escena
            const posicionNave = { x: this.jugador.x, y: this.jugador.y }; // Guarda posición

            let sonido = this.sound.add('sonido');  //añadir el efecto de sonido 
            sonido.play({
            volume: 0.5 
            });
            this.scene.start('Escena2', { puntaje: this.puntaje, puntajeMaximo: this.puntajeMaximo, posicionNave });// Cambiar a la siguiente escena y pasa el puntaje
        }
    }
    /** Metodo para la generacion de meteoritos */
    generarMeteoros() {
        const x = Phaser.Math.Between(0, 1326); //posicion aleatoria en el eje x
        const meteoro = this.grupoMeteoros.create(x, 0, 'meteoro'); //Crear un meteorito
        meteoro.play('meteoro_cayendo'); // animacion del meteoro
        meteoro.setVelocityY(200); //Velocidad vertical hacia abajo
    }
    /** Metodo para mostrar la escena game over */
    gameOver(jugador) {
        this.physics.pause(); //Pausar el juego
        jugador.setTint(0xff0000);//Cambiar color para indicar impacto
        console.log('GameOver');
        if (this.puntaje > this.puntajeMaximo) {
            this.puntajeMaximo = this.puntaje;
        }
        this.scene.start('GameOver', { puntaje: this.puntaje, puntajeMaximo: this.puntajeMaximo});
         //Escena GameOver y mostrar puntaje
    }

} 

export default Escena1;
