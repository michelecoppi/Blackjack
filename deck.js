class Deck {

    constructor(cards) {
        this.cards = cards.map(card => ({ ...card }));
        this.cardsCopy = this.cards.map(card => ({ ...card }));
    }

    shuffle() {
        for (let i = this.cardsCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cardsCopy[i], this.cardsCopy[j]] = [this.cardsCopy[j], this.cardsCopy[i]];
        }
    }

    drawCard() {
        return this.cardsCopy.pop();
    }

    reset() {
        this.cardsCopy = this.cards.map(card => ({ ...card }));
        this.shuffle();
    }
}


export default Deck;
