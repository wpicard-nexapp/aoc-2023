import { readFileSync } from "fs";
import { argv } from "process";

const fileName = argv[2];
const lines = readFileSync(fileName, { encoding: "utf-8" }).split("\n");
const times = parseNumbers(lines[0]);
const distancesToBeat = parseNumbers(lines[1]);

const f = (totalTime: number, waitTime: number) => waitTime * (totalTime - waitTime);

let result = 1;
times.forEach((totalTime, index) => {
  const distanceToBeat = distancesToBeat[index];

  let n = 0;
  for (let waitTime = 0; waitTime <= totalTime; waitTime++) {
    const distance = f(totalTime, waitTime);
    if (distance > distanceToBeat) {
      n++;
    }
  }

  result *= n;
});

console.log(result);

function parseNumbers(line: string) {
  return line
    .split(/\s+/)
    .splice(1)
    .map((n) => Number.parseInt(n));
}
