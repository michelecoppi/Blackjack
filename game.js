import Player from './player.js';
import Deck from './deck.js';

class Game {
    constructor() {
        this.player = new Player('player');
        this.dealer = new Player('dealer');
        this.deck = null;
    }

    async fetchCards() {
        try {
            const response = await fetch('cards.json');
            const data = await response.json();
            this.deck = new Deck(data.deck);
            this.deck.shuffle();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async start() {
        await this.fetchCards();
        this.newGame();
    }

    newGame() {
        this.player.reset();
        this.dealer.reset();
        this.deck.reset();

        this.giveStartingCards(this.player);
        this.giveStartingCards(this.dealer);

        this.showCards(this.player);
        this.showCards(this.dealer);

        this.updatePoints(this.player);

        this.checkIfBlackjack(this.player);
        

        document.getElementById('new_game').classList.add('hidden');
        document.getElementById('draw').classList.remove('hidden');
        document.getElementById('stay').classList.remove('hidden');
    }

    checkIfBlackjack(player) {
        let counter = 0;
        player.cards.forEach(card => {
            if (card.value === 'A') {
                counter+=11;
            } else if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
                counter+=10;
            }
        });

        if (counter === 21) {
            console.log(player.name + " got a blackjack");
            setTimeout(() => this.checkWinner(), 2000);
        }
    }

    giveStartingCards(player) {
        for (let i = 0; i < 2; i++) {
            const card = this.deck.drawCard();
            let isAce = player.addCard(card);
            if (isAce) {
                player.handleAce();
            }
        }
    }

    drawCard(player) {
        const card = this.deck.drawCard();
        let isAce = player.addCard(card);
        this.showCard(card, document.getElementById(player.name));
        if (isAce) {
                player.handleAce();
        }
        if (player.name === "player") {
            this.updatePoints(player);
            this.checkIfBust(player);
        }
    }

    showCards(player) {
        let cardDiv = document.getElementById(player.name);
        cardDiv.innerHTML = '';

        player.cards.forEach((card, index) => {
            if (player.name === 'dealer' && index === 0) {
                let img = document.createElement('img');
                img.src = card.src_back;
                img.style.width = '100px';
                img.classList.add('slide-in');
                cardDiv.appendChild(img);
            } else {
                this.showCard(card, cardDiv);
            }
        });
    }

    showCard(card, cardDiv) {
        let img = document.createElement('img');
        img.src = card.src;
        img.style.width = '100px';
        img.classList.add('slide-in');
        cardDiv.appendChild(img);
    }

    checkIfBust(player) {
        if (player.points > 21) {
            console.log(player.name + " are busted");
            setTimeout(() => this.checkWinner(), 2000);
        }
    }

    checkWinner() {

        if (this.player.points > 21) {
            console.log('Dealer wins');
        } else if (this.dealer.points > 21) {
            console.log('Player1 wins');
        } else if (this.player.points > this.dealer.points) {
            console.log('Player1 wins');
        } else if (this.player.points < this.dealer.points) {
            console.log('Dealer wins');
        } else {
            console.log('It is a draw');
        }

        this.resetGame();
    }

    resetGame() {
        this.player.reset();
        this.dealer.reset();

        document.getElementById('player').innerHTML = '';
        document.getElementById('dealer').innerHTML = '';

        document.getElementById('player_points').textContent = '';
        

        document.getElementById('new_game').classList.remove('hidden');
        document.getElementById('draw').classList.add('hidden');
        document.getElementById('stay').classList.add('hidden');
    }

    dealerTurn() {
        let divDealer = document.getElementById('dealer').firstElementChild;
        divDealer.src = this.dealer.cards[0].src;

        const drawCards = () => {
            if (this.dealer.points < 17) {
                this.drawCard(this.dealer);
                setTimeout(drawCards, 2000);
            } else {
                this.checkWinner();
            }
        };
    
        setTimeout(drawCards, 2000);
    }

    updatePoints(player) {
        document.getElementById(`${player.name}_points`).textContent= `${player.points} points`;
    }
}

export default Game;
