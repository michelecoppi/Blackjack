class Player {
    constructor(name) {
        this.name = name;
        this.points = 0;
        this.cards = [];
    }

    addCard(card) {
        this.cards.push(card);
        return this.calculateCardValue(card); 
    }

    calculateCardValue(card) {
        const cardValue = card.value;
        if (cardValue === "A") {
            return true; 
        } else if (cardValue === "J" || cardValue === "Q" || cardValue === "K") {
            this.points += 10;
        } else {
            this.points += Number(cardValue);
        }
        return false; 
    }

    handleAce() {
        if (this.name === "player") {
            let aceValue = prompt("1 or 11?");
            while (aceValue !== "1" && aceValue !== "11") {
                aceValue = prompt("Please enter 1 or 11");
            }
            this.points += Number(aceValue);
        } else if (this.name === "dealer") {
            
            if (this.points + 11 > 21) {
                this.points += 1;
            } else {
                this.points += 11;
            }
        }
    }

    reset() {
        this.points = 0;
        this.cards = [];
    }
}

export default Player;
