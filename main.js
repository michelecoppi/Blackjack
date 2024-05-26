import Game from './game.js';

let game = new Game();



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
    stayBtn.setAttribute('disabled', true);
    drawBtn.setAttribute('disabled', true);
    game.dealerTurn();
});
