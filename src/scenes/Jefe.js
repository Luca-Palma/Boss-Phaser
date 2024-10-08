class Jefe extends Phaser.Scene {
    constructor() {
        super("Jefe");
        this.jugador = null;
        this.cursors = null;
        this.puntaje = 0;
        this.puntajeMaximo = 0;
        this.textoPuntaje = 0;
        this.grupoBalas = null;
        this.bulletTime = 0;
        this.enemigo = null;
        this.grupoBalasEnemigo = null;
        this.velocidadEnemigo = 200;
    }

    preload() {
        this.load.image('background', '/public/resources/img/background2.jpg');
        this.load.spritesheet('meteoro', '/public/resources/img/meteoro2.png', { frameWidth: 40, frameHeight: 55.5 });
        this.load.spritesheet('supernave', '/public/resources/img/supernave.png', { frameWidth: 90, frameHeight: 215 });
        this.load.spritesheet('enemigo', '/public/resources/img/supernave-enemiga.png', { frameWidth: 90, frameHeight: 215 }); // Spritesheet del enemigo
        this.load.audio('sonido','/public/resources/sounds/sonido.mp3');
        this.load.image('bullet', '/public/resources/img/laserBullet-arriba.png');
        this.load.image('bullet-enemiga', '/public/resources/img/laserBullet-enemiga-abajo.png');
        this.load.audio('laserSound', '/public/resources/sounds/laserSound.mp3');
    }

    init(data) {
        this.puntaje = data.puntaje; //Recibe el puntaje
        this.puntajeMaximo = data.puntajeMaximo || 0;
        this.posicionNave = data.posicionNave; // Obtener posición de la nave
    }

    create() {
        this.background = this.add.tileSprite(663, 298, 1326, 596, 'background'); // Fondo con tileSprite
        this.jugador = this.physics.add.sprite(this.posicionNave.x, this.posicionNave.y, 'supernave'); // Nave del jugador

        // Animaciones del jugador
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('supernave', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'derecha',
            frames: this.anims.generateFrameNumbers('supernave', { start: 1, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'izquierda',
            frames: this.anims.generateFrameNumbers('supernave', { start: 5, end: 7 }),
            frameRate: 10,
            repeat: 0
        });

        this.jugador.setCollideWorldBounds(true); // Mantener la nave dentro de la pantalla

        this.cursors = this.input.keyboard.createCursorKeys(); // Controles del jugador

        // Mostrar mensaje "Jefe"
        this.mensaje = this.add.text(663, 150, 'Jefe', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        this.time.delayedCall(2000, () => {
            this.mensaje.destroy(); // Eliminar el mensaje después de 2 segundos
        });

        // Mostrar puntaje
        this.textoPuntaje = this.add.text(18, 18, 'Puntaje: 0', { fontSize: '32px', fill: '#fff' });

        // Disparar al hacer clic
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                let sonido = this.sound.add('laserSound');  // Efecto de sonido
                sonido.play({ volume: 0.2 });
                this.generarBalas();
            }
        });
        this.grupoBalas = this.physics.add.group();

        // Crear animaciones para el enemigo
        this.anims.create({
            key: 'patrulla',
            frames: this.anims.generateFrameNumbers('enemigo', { start: 0, end: 3 }), // Ajusta según tu spritesheet
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'disparar',
            frames: this.anims.generateFrameNumbers('enemigo', { start: 4, end: 6 }), // Ajusta según tu spritesheet
            frameRate: 10,
            repeat: 0
        });

        // Crear el enemigo en la parte superior
        this.enemigo = this.physics.add.sprite(663, 50, 'enemigo');
        this.enemigo.setScale(0.5); // Ajusta el tamaño del enemigo a la mitad
        this.enemigo.setCollideWorldBounds(true); // Mantener dentro de la pantalla

        // Reproducir animación de patrulla
        this.enemigo.anims.play('patrulla', true);

        // Crear un grupo para las balas del enemigo
        this.grupoBalasEnemigo = this.physics.add.group();

        // Temporizador para el disparo del enemigo
        this.time.addEvent({
            delay: 2000, // Dispara cada 2 segundos
            callback: this.enemigoDisparar,
            callbackScope: this,
            loop: true
        });

        // Configurar colisiones entre balas enemigas y el jugador
        this.physics.add.overlap(this.jugador, this.grupoBalasEnemigo, this.jugadorImpactado, null, this);
    }

    generarBalas() {
        if (this.time.now > this.bulletTime) {
            const bullet = this.grupoBalas.create(this.jugador.x, this.jugador.y - 60, 'bullet');
            bullet.setVelocityY(-400);
            this.bulletTime = this.time.now + 200;
        }
    }

    enemigoDisparar() {
        // Reproducir animación de disparo
        this.enemigo.anims.play('disparar', true);

        // Crear la bala
        const bala = this.grupoBalasEnemigo.create(this.enemigo.x, this.enemigo.y-80 + this.enemigo.height / 2, 'bullet-enemiga');
        bala.setVelocityY(300);
        bala.setScale(1);
        bala.body.allowGravity = false;

        // Volver a la animación de patrulla después de la animación de disparo
        this.enemigo.on('animationcomplete', () => {
            this.enemigo.anims.play('patrulla', true);
        }, this);
    }

    update() {
        this.background.tilePositionY -= 2; // Desplazamiento del fondo
        this.jugador.setVelocityX(0); // Detener movimiento horizontal
        this.jugador.setVelocityY(0); // Detener movimiento vertical

        // Movimiento del jugador
        if (this.cursors.left.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('a'))) {
            this.jugador.setVelocityX(-300);
            this.jugador.anims.play('izquierda', true);
        } else if (this.cursors.right.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('d'))) {
            this.jugador.setVelocityX(300);
            this.jugador.anims.play('derecha', true);
        } else {
            this.jugador.anims.play('idle', true);
        }

        if (this.cursors.up.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('w'))) {
            this.jugador.setVelocityY(-300);
        } else if (this.cursors.down.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('s'))) {
            this.jugador.setVelocityY(300);
        }

        // Actualizar puntaje
        this.puntaje += 1;
        this.textoPuntaje.setText('Puntaje: ' + this.puntaje);

        // Verificar si se alcanza el puntaje para pasar a la siguiente escena
        if (this.puntaje >= 2000) {
            const posicionNave = { x: this.jugador.x, y: this.jugador.y };

            let sonido = this.sound.add('sonido');
            sonido.play({ volume: 0.5 });
            this.scene.start('Victory', { puntaje: this.puntaje, puntajeMaximo: this.puntajeMaximo, posicionNave });
        }

        // Mover al enemigo de lado a lado
        this.enemigo.setVelocityX(this.velocidadEnemigo);

        // Cambiar de dirección al llegar a los bordes de la pantalla
        if (this.enemigo.x >= 1326 - this.enemigo.width / 2) { // Límite derecho
            this.velocidadEnemigo = -200;
        } else if (this.enemigo.x <= this.enemigo.width / 2) { // Límite izquierdo
            this.velocidadEnemigo = 200;
        }
    }

    jugadorImpactado(jugador, bala) {
        bala.destroy(); // Eliminar la bala cuando impacta
        this.gameOver(jugador); // Llamar a la función game over
    }

    gameOver(jugador) {
        this.physics.pause(); // Pausar el juego
        jugador.setTint(0xff0000); // Cambiar color para indicar impacto
        console.log('GameOver');
        if (this.puntaje > this.puntajeMaximo) {
            this.puntajeMaximo = this.puntaje;
        }
        this.scene.start('GameOver', { puntaje: this.puntaje, puntajeMaximo: this.puntajeMaximo });
    }
}

export default Jefe;
