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

    async newGame() {
        this.player.reset();
        this.dealer.reset();
        this.deck.reset();

        this.giveStartingCards(this.player);
        this.giveStartingCards(this.dealer);

        this.showCards(this.player);
        this.showCards(this.dealer);

        if (this.checkIfBlackjack(this.player) || this.checkIfBlackjack(this.dealer)) {
            this.checkWinner();
        } else {
            this.updatePoints(this.player);

            document.getElementById('player_name').classList.remove('hidden');
            document.getElementById('dealer_name').classList.remove('hidden');

            document.getElementById('new_game').classList.add('hidden');
            document.getElementById('draw').classList.remove('hidden');
            document.getElementById('stay').classList.remove('hidden');

        }
    }

    checkIfBlackjack(player) {

        if (player.cards.length > 2) {
            return false;
        }
        return (this.isAce(player.cards[0]) && this.isValueTenCard(player.cards[1])) ||
            (this.isAce(player.cards[1]) && this.isValueTenCard(player.cards[0]));
    }

    giveStartingCards(player) {
        for (let i = 0; i < 2; i++) {
            const card = this.deck.drawCard();
            player.addCard(card);
        }
    }


    drawCard(player) {
        const card = this.deck.drawCard();
        player.addCard(card);
        this.showCard(card, document.getElementById(player.name));
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
            console.log(`${player.name} busted`);
            document.getElementById('draw').setAttribute('disabled', true);
            document.getElementById('stay').setAttribute('disabled', true);
            setTimeout(() => this.checkWinner(), 2000);
        }
    }

    checkWinner() {
        let resultText = document.getElementById('result');
        if (this.checkIfBlackjack(this.player) && this.checkIfBlackjack(this.dealer)) {
            this.showDealerCard();
            resultText.innerHTML = 'Push: both have blackjack';
            console.log('Push');
        } else if (this.checkIfBlackjack(this.player)) {
            this.showDealerCard();
            resultText.innerHTML = 'Player wins with a blackjack';
            console.log('Player wins');
        } else if (this.checkIfBlackjack(this.dealer)) {
            this.showDealerCard();
            resultText.innerHTML = 'Dealer wins with a blackjack';
            console.log('Dealer wins');
        } else if (this.player.points > 21) {
            resultText.innerHTML = 'Dealer wins because player busted';
            console.log('Dealer wins');
        } else if (this.dealer.points > 21) {
            resultText.innerHTML = 'Player wins because dealer busted';
            console.log('Player wins');
        } else if (this.player.points > this.dealer.points) {
            resultText.innerHTML = `Player wins with ${this.player.points} points against ${this.dealer.points} points`;
            console.log('Player wins');
        } else if (this.player.points < this.dealer.points) {
            resultText.innerHTML = `Dealer wins with ${this.dealer.points} points against ${this.player.points} points`;
            console.log('Dealer wins');
        } else {
            resultText.innerHTML = `It is a draw with ${this.player.points} points`;
            console.log('It is a draw');
        }
        setTimeout(() => this.resetGame(), 3000);
    }

    resetGame() {
        this.player.reset();
        this.dealer.reset();

        document.getElementById('player').innerHTML = '';
        document.getElementById('dealer').innerHTML = '';

        document.getElementById('player_points').textContent = '';
        document.getElementById('dealer_points').textContent = '';

        document.getElementById('result').innerHTML = '';

        document.getElementById('player_name').classList.add('hidden');
        document.getElementById('dealer_name').classList.add('hidden');


        document.getElementById('new_game').classList.remove('hidden');

        let draw = document.getElementById('draw');
        draw.classList.add('hidden');
        draw.removeAttribute('disabled');

        let stay = document.getElementById('stay');
        stay.classList.add('hidden');
        stay.removeAttribute('disabled');
    }

    dealerTurn() {
        this.showDealerCard();
        this.updatePoints(this.dealer);


        const drawCards = () => {
            if (this.dealer.points < 17) {
                this.drawCard(this.dealer);
                this.updatePoints(this.dealer);
                setTimeout(drawCards, 2000);
            } else {
                this.checkWinner();
            }
        };

        setTimeout(drawCards, 2000);
    }

    showDealerCard() {
        let divDealer = document.getElementById('dealer').firstElementChild;
        divDealer.src = this.dealer.cards[0].src;
    }

    updatePoints(player) {
        let softLabel = player.softAces > 0 ? " (soft)" : "";
        document.getElementById(`${player.name}_points`).textContent = `${player.points} points${softLabel}`;
    }
    isValueTenCard(card) {
        return card.value === '10' || card.value === 'J' || card.value === 'Q' || card.value === 'K';
    }
    isAce(card) {
        return card.value === 'A';
    }
}

export default Game;