import { readFileSync } from "fs";
import { argv } from "process";

const fileName = argv[2];
const data = readFileSync(fileName, { encoding: "utf-8" }).split("\n");

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

function isNumber(char: string) {
  return !Number.isNaN(Number.parseInt(char));
}
