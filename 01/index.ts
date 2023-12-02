import { readFileSync } from "fs";
import { argv } from "process";

const fileName = argv[2];
const data = readFileSync(fileName, { encoding: "utf-8" }).split("\n").map(parseLine);

let result = 0;

for (const line of data) {
  let first: string | undefined;
  let last: string | undefined;

  for (const char of line) {
    if (isNumber(char)) {
      if (first === undefined) {
        first = char;
      }
      last = char;
    }
  }

  if (first && last) {
    result += Number.parseInt(first + last);
  }
}

console.log(result);

function parseLine(line: string): string {
  let output = "";

  for (let index = 0; index < line.length; index++) {
    const char = line[index];
    const partialLine = line.substring(index);
    const beginsWithTextualNumber = /^(one|two|three|four|five|six|seven|eight|nine)/;
    const partialLineBeginsWithTextualNumber = partialLine.match(beginsWithTextualNumber);

    if (isNumber(char)) {
      output += char;
    } else if (partialLineBeginsWithTextualNumber) {
      output += textualNumberToNumber(partialLineBeginsWithTextualNumber[0]);
    }
  }

  return output;
}

function isNumber(char: string) {
  return !Number.isNaN(Number.parseInt(char));
}

function textualNumberToNumber(textualNumber: string): string {
  switch (textualNumber) {
    case "one":
      return "1";
    case "two":
      return "2";
    case "three":
      return "3";
    case "four":
      return "4";
    case "five":
      return "5";
    case "six":
      return "6";
    case "seven":
      return "7";
    case "eight":
      return "8";
    case "nine":
      return "9";
    default:
      throw new Error(`"${textualNumber}" is not a textual number`);
  }
}
