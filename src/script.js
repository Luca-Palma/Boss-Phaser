import Escena1 from "./scenes/Escena1.js"
import GameOver from "./scenes/GameOver.js"
import Escena2 from "./scenes/Escena2.js"
import Escena3 from "./scenes/Escena3.js"
import Inicio from "./scenes/Inicio.js"
import Escena4 from "./scenes/Escena4.js"
import Bonustrack from "./scenes/Bonustrack.js"
import Victory from "./scenes/Victory.js"
import Jefe from "./scenes/Jefe.js"
import Jefe2 from "./scenes/Jefe2.js"

const config = {
    type: Phaser.AUTO,
    width: 1326,
    height: 595,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Inicio, Escena1, GameOver, Escena2, Escena3, Escena4, Bonustrack, Victory, Jefe, Jefe2],
};
let game = new Phaser.Game(config);