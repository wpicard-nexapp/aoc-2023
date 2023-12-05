import { readFileSync } from "fs";
import { argv } from "process";

type Card = {
  winningNumbers: Set<number>;
  numbers: Set<number>;
};

const fileName = argv[2];
const cards = readFileSync(fileName, { encoding: "utf-8" }).split("\n").map(parseCard);
const cardValues = cards.map(calculateCardValue);
const result = cardValues.reduce((sum, value) => sum + value, 0);

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

function calculateCardValue(card: Card) {
  let numberOfMatch = 0;

  card.winningNumbers.forEach((winningNumber) => {
    if (card.numbers.has(winningNumber)) {
      numberOfMatch++;
    }
  });

  return numberOfMatch > 0 ? Math.pow(2, numberOfMatch - 1) : 0;
}
