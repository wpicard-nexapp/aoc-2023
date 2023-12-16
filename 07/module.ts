type Hand = {
  cardValues: number[];
  typeValue: number;
  bid: number;
};

export function parseHand(line: string): Hand {
  const [cards, bid] = line.split(" ");

  return {
    cardValues: [...cards].map(parseCardValue),
    typeValue: calculateTypeValue(cards),
    bid: Number.parseInt(bid),
  };
}

function parseCardValue(card: string) {
  const valueByCard: Record<string, number> = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    T: 10,
    J: 11,
    Q: 12,
    K: 14,
    A: 15,
  };

  return valueByCard[card];
}

function calculateTypeValue(cards: string) {
  const descendingCounts = calculateCountByType(cards).sort((a, b) => -(a - b));

  if (descendingCounts[0] === 5) {
    return 6;
  }
  if (descendingCounts[0] === 4) {
    return 5;
  }
  if (descendingCounts[0] === 3 && descendingCounts[1] === 2) {
    return 4;
  }
  if (descendingCounts[0] === 3) {
    return 3;
  }
  if (descendingCounts[0] === 2 && descendingCounts[1] === 2) {
    return 2;
  }
  if (descendingCounts[0] === 2) {
    return 1;
  }

  return 0;
}

function calculateCountByType(cards: string) {
  const countByType: Record<string, number> = {};

  for (const card of cards) {
    const previousCount = countByType[card] ?? 0;
    countByType[card] = previousCount + 1;
  }

  return Object.values(countByType);
}

export function compareHand(hand1: Hand, hand2: Hand) {
  if (hand1.typeValue > hand2.typeValue) {
    return 1;
  }
  if (hand1.typeValue < hand2.typeValue) {
    return -1;
  }

  for (let index = 0; index < hand1.cardValues.length; index++) {
    const hand1CardValue = hand1.cardValues[index];
    const hand2CardValue = hand2.cardValues[index];

    if (hand1CardValue !== hand2CardValue) {
      return hand1CardValue - hand2CardValue;
    }
  }

  return 0;
}
