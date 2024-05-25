import Game from './game.js';

let game = new Game();

// gestire meglio l'evento dell'asso
// aggiungere il blackjack


window.onload = function () {
    game.start();
}

let newGameBtn = document.getElementById('new_game');
newGameBtn.addEventListener('click', function () {
    game.newGame();
});

let drawBtn = document.getElementById('draw');
drawBtn.addEventListener('click', function () {
    game.drawCard(game.player);
});

let stayBtn = document.getElementById('stay');
stayBtn.addEventListener('click', function () {
    game.dealerTurn();
});
