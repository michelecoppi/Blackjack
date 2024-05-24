
let cards;
let cardsCopy;
// fare oggetti con i costruttori(player,dealer,game)
// aggiunta blackjack
// gestione asso

const player1 = {
    name: 'player1',
    points: 0,
    cards: []
};

const dealer = {
    name: 'dealer',
    points: 0,
    cards: []
};

async function fetchCards() {
    try {
        const response = await fetch('cards.json');
        const data = await response.json();
        cards = data.deck;
    } catch (error) {
        console.error('Error:', error);
    }
}

window.onload = async function () {
    await fetchCards();
    startGame();
}

function giveStartingCards(player) {
    for (let i = 0; i < 2; i++) {
        giveCard(player);
    }
}

function giveCard(player) {
    let card = cardsCopy[Math.floor(Math.random() * cardsCopy.length)];
    player.cards.push(card);
    cardsCopy.splice(cardsCopy.indexOf(card), 1);
    return card;
}

function showCards(player) {
    let cardDiv = document.getElementById(player.name);

    player.cards.forEach((card, index) => {
        if (player.name === 'dealer' && index === 0) {
            let img = document.createElement('img');
            img.src = card.src_back;
            img.style.width = '100px';
            img.classList.add('slide-in');
            cardDiv.appendChild(img);
        } else {
            showCard(card, cardDiv);
        }
    });

}

function showCard(card, cardDiv) {
    let img = document.createElement('img');

    img.src = card.src;
    img.style.width = '100px';
    img.classList.add('slide-in');
    cardDiv.appendChild(img);
}

function drawCard(player) {
    removeSlideIn();
    let drawcard = giveCard(player);
    showCard(drawcard, document.getElementById(player.name));
    calculateLastCardValue(player);
   
}

function removeSlideIn() {
    let images = document.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
        images[i].classList.remove('slide-in');
    }
}

function calculateLastCardValue(player) {

    checkCardValue(player, player.cards.length - 1);


}

function checkTwoStartingCards(player) {
    for (let i = 0; i < player.cards.length; i++) {
        checkCardValue(player, i);
    }
}

function checkCardValue(player, position) {
    const cardValue = player.cards[position].value;
    if (cardValue === "A" && player.points + 11 <= 21) {
        player.points += 11;
    } else if (cardValue === "A" && player.points + 11 > 21) {
        player.points += 1;
    } else if (cardValue === "J" || cardValue === "Q" || cardValue === "K") {
        player.points += 10;
    } else {
        player.points += Number(cardValue);
    }

}

function checkifBust(player) {
    if (player.points > 21) {
        console.log(player.name + " are busted");
        setTimeout(checkWinner, 2000);
    }
}

function checkWinner() {
    console.log(`player score: ${player1.points}`);
    console.log(`dealer score: ${dealer.points}`);
    if (player1.points > 21) {
        console.log('Dealer wins');
    } else if (dealer.points > 21) {
        console.log('Player1 wins');
    } else if (player1.points > dealer.points) {
        console.log('Player1 wins');
    } else if (player1.points < dealer.points) {
        console.log('Dealer wins');
    } else {
        console.log('It is a draw');
    }
    player1.points = 0;
    dealer.points = 0;
    player1.cards = [];
    dealer.cards = [];
    let cardDiv = document.getElementById('player1');
    cardDiv.innerHTML = '';
    cardDiv = document.getElementById('dealer');
    cardDiv.innerHTML = '';
    newGame.classList.remove('hidden');
    draw.classList.add('hidden');
    stay.classList.add('hidden');
    // alert("Start new game");
    // setTimeout(startGame, 2000);
}

function startGame() {

    cardsCopy = cards.map(card => ({ ...card }));
    giveStartingCards(player1);
    giveStartingCards(dealer);
    checkTwoStartingCards(player1);
    checkTwoStartingCards(dealer);
    showCards(player1);
    showCards(dealer);
    newGame.classList.add('hidden');
    draw.classList.remove('hidden');
    stay.classList.remove('hidden');
    console.log("ho eseguito startgame");
}

let newGame = document.getElementById('new_game');
newGame.addEventListener('click', function (){
    startGame();
});

let draw = document.getElementById('draw');
draw.addEventListener('click', function () {
    drawCard(player1);
    checkifBust(player1);
});

let stay = document.getElementById('stay');
stay.addEventListener('click', function () {

    let divDealer = document.getElementById('dealer').firstElementChild;
    divDealer.src = dealer.cards[0].src;

    setTimeout(function () {

        while (dealer.points < 17) {
            drawCard(dealer);
        }

        checkWinner();
    }, 2000);
});


