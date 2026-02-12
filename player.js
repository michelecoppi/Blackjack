class Player {
    constructor(name) {
        this.name = name;
        this.points = 0;
        this.cards = [];
        this.softAces = 0;
    }

    addCard(card) {
        this.cards.push(card);
        return this.calculateCardValue(card); 
    }

    calculateCardValue(card) {
        const cardValue = card.value;
        if (cardValue === "A") {
            this.points += 11;
            this.softAces += 1;
            this.adjustForAces();
            return true;
        } else if (cardValue === "J" || cardValue === "Q" || cardValue === "K") {
            this.points += 10;
        } else {
            this.points += Number(cardValue);
        }
        this.adjustForAces();
        return false; 
    }

    adjustForAces() {
        while (this.points > 21 && this.softAces > 0) {
            this.points -= 10;
            this.softAces -= 1;
        }
    }

    reset() {
        this.points = 0;
        this.cards = [];
        this.softAces = 0;
    }
}

export default Player;
