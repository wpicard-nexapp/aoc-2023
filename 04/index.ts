import { readFileSync } from "fs";
import { argv } from "process";

type Card = {
  winningNumbers: Set<number>;
  numbers: Set<number>;
};

const fileName = argv[2];
const cards = readFileSync(fileName, { encoding: "utf-8" }).split("\n").map(parseCard);
const numberOfMatchPerCard = cards.map(calculateNumberOfMatch);
const result = calculateTotalNumberOfCard(numberOfMatchPerCard);

console.log(result);

function parseCard(line: string): Card {
  const [, winningNumbers, numbers] = line.match(/Card +\d+: +([^|]+)\| +([^|]+)/) ?? throwError("Couldn't parse card");

  return {
    winningNumbers: parseNumbers(winningNumbers),
    numbers: parseNumbers(numbers),
  };
}

function parseNumbers(numbers: string) {
  return new Set(
    numbers
      .trim()
      .split(/ +/)
      .map((number) => Number.parseInt(number))
  );
}

function throwError(message: string): never {
  throw new Error(message);
}

function calculateNumberOfMatch(card: Card) {
  let numberOfMatch = 0;

  card.winningNumbers.forEach((winningNumber) => {
    if (card.numbers.has(winningNumber)) {
      numberOfMatch++;
    }
  });

  return numberOfMatch;
}

function calculateTotalNumberOfCard(numberOfMatchPerCard: number[]) {
  const numberOfCards = Array.from({ length: numberOfMatchPerCard.length }, () => 1);

  numberOfMatchPerCard.forEach((numberOfMatch, index) => {
    for (let cardCopyIndex = index + 1; cardCopyIndex <= index + numberOfMatch; cardCopyIndex++) {
      numberOfCards[cardCopyIndex] += numberOfCards[index];
    }
  });

  return numberOfCards.reduce((totalNumberOfCard, numberOfCard) => totalNumberOfCard + numberOfCard, 0);
}
