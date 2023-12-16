import { readFileSync } from "fs";
import { argv } from "process";
import { parseHand, compareHand } from "./module";

const fileName = argv[2];
const hands = readFileSync(fileName, { encoding: "utf-8" }).split("\n").map(parseHand);
const sortedHands = hands.toSorted(compareHand);

let result = 0;
for (let index = 0; index < sortedHands.length; index++) {
  const { bid } = sortedHands[index];
  result += (index + 1) * bid;
}

console.log(result);
