function generatePaiMountain() {
    const suits = ['m', 'p', 's']; // 萬子, 筒子, 索子
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const winds = ['E', 'S', 'W', 'N']; // 東, 南, 西, 北
    const dragons = ['C', 'F', 'P']; // 中, 發, 白

    let tiles = [];

    // Add number tiles
    for (let suit of suits) {
        for (let number of numbers) {
            tiles.push(suit + number);
            tiles.push(suit + number);
            tiles.push(suit + number);
            // 赤１×３
            if (number == 5) {
                tiles.push(suit + '0');
            } else {
                tiles.push(suit + number);
            }
        }
    }

    // Add wind tiles
    for (let wind of winds) {
        tiles.push(wind);
        tiles.push(wind);
        tiles.push(wind);
        tiles.push(wind);
    }

    // Add dragon tiles
    for (let dragon of dragons) {
        tiles.push(dragon);
        tiles.push(dragon);
        tiles.push(dragon);
        tiles.push(dragon);
    }

    // Shuffle the tiles to randomize
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    return tiles;
}

function displayPaiMountain() {
    const paiMountain = generatePaiMountain();
    const outputElem = document.getElementById('pai_mountain');
    outputElem.innerHTML = ''; // 出力エリアをクリア

    let htmlContent = '';
    for (let i = 0; i < paiMountain.length; i++) {
        if (i > 0 && i % 17 === 0) {
            htmlContent += '<br>'; // 17牌ごとに改行
        }
        htmlContent += `<span class="t_${paiMountain[i]}" name="${i}"></span> `;
    }
    outputElem.innerHTML = htmlContent;
    // 手牌を配る
    let default_hands = dealHands(paiMountain);
    const hands = sortAllHands(default_hands);
    // 親
    const outputElem_deal_east = document.getElementById('deal_east');
    let htmlContent_deal_east = '東：';
    for (let i = 0; i < hands.east.length; i++) {
        htmlContent_deal_east += `<span class="t_${hands.east[i]}" name="he_${i}"></span> `;
    }
    outputElem_deal_east.innerHTML = htmlContent_deal_east;
    const outputElem_deal_south = document.getElementById('deal_south');
    let htmlContent_deal_south = '南：';
    for (let i = 0; i < hands.south.length; i++) {
        htmlContent_deal_south += `<span class="t_${hands.south[i]}" name="he_${i}"></span> `;
    }
    outputElem_deal_south.innerHTML = htmlContent_deal_south;
    const outputElem_deal_west = document.getElementById('deal_west');
    let htmlContent_deal_west = '西：';
    for (let i = 0; i < hands.west.length; i++) {
        htmlContent_deal_west += `<span class="t_${hands.west[i]}" name="he_${i}"></span> `;
    }
    outputElem_deal_west.innerHTML = htmlContent_deal_west;
    const outputElem_deal_north = document.getElementById('deal_north');
    let htmlContent_deal_north = '北：';
    for (let i = 0; i < hands.north.length; i++) {
        htmlContent_deal_north += `<span class="t_${hands.north[i]}" name="he_${i}"></span> `;
    }
    outputElem_deal_north.innerHTML = htmlContent_deal_north;

}

// これサイコロ振る意味ある？
function rollDice() {
    const dice1 = Math.floor(Math.random() * 6) + 1; // 1 to 6
    const dice2 = Math.floor(Math.random() * 6) + 1; // 1 to 6
    const sum_dice = dice1 + dice2;
    const diceOutput = document.getElementById('diceOutput');
    diceOutput.textContent = `サイコロ1: ${dice1}, サイコロ2: ${dice2} 合計: ${sum_dice}`;


    const outputElem = document.getElementById('dicePict');
    outputElem.innerHTML = ''; // 出力エリアをクリア
    let htmlContent = '';
    htmlContent += `<span class="sai${dice1}" name="dice1"></span> `;
    htmlContent += `<span class="sai${dice2}" name="dice2"></span> `;
    outputElem.innerHTML = htmlContent;

}


function dealHands(paiMountain) {
    const hands = {
        east: [],   // 親 (East)
        south: [],  // 子 (South)
        west: [],   // 子 (West)
        north: []   // 子 (North)
    };
    // TODO サイコロでスタート地点決めて…
    // 親に14枚配る
    for (let i = 0; i < 14; i++) {
        hands.east.push(paiMountain.pop());
    }

    // 3人の子に13枚ずつ配る
    for (let i = 0; i < 13; i++) {
        hands.south.push(paiMountain.pop());
        hands.west.push(paiMountain.pop());
        hands.north.push(paiMountain.pop());
    }

    return hands;
}

function sortHand(hand) {
    const order = {
        'm': 1,
        'p': 2,
        's': 3,
        'E': 4, 'S': 5, 'W': 6, 'N': 7,
        'C': 8, 'F': 9, 'P': 10
    };

    return hand.sort((a, b) => {
        const suitA = a[0];
        const suitB = b[0];
        const numberA = parseInt(a[1] || 0);
        const numberB = parseInt(b[1] || 0);

        if (suitA === suitB) {
            return numberA - numberB;
        } else {
            return order[suitA] - order[suitB];
        }
    });
}

function sortAllHands(hands) {
    hands.east = sortHand(hands.east);
    hands.south = sortHand(hands.south);
    hands.west = sortHand(hands.west);
    hands.north = sortHand(hands.north);
    return hands;
}