import '../css/style.css'
import {Game} from "./game/classes/game.ts";

import './game/classes/utils/es.ts';

const game: Game = new Game('#game', {
    debug: true, collisionBoxes: false,
});
// @ts-ignore
window.game = game;
game.setDifficulty('medium');
game.setScoreLimit(5);
game.setTimeLimit(30);
game.clearHighScore();
game.setSurvivalMode(false);


document.addEventListener('DOMContentLoaded', async (): Promise<void> => {
    await game.init();

    // game.on('started', (e: Event | CustomEvent): void => {
    //     // @ts-ignore
    //     console.log(e)
    // })

    game.on('gameOver', (e: Event | CustomEvent): void => {
        // @ts-ignore
        console.log(e.detail)
        // if (e.detail.deadReason === 'win') {
        //     alert('You win!');
        // } else {
        //     alert('You lose!');
        // }
    })
});