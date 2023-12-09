import { readFileSync } from "fs";
import { argv } from "process";

type AlmanacMap = {
  destinationNumber: number;
  sourceNumber: number;
  length: number;
};

const fileName = argv[2];
const lines = readFileSync(fileName, { encoding: "utf-8" }).split("\n");
const { seedNumbers, mapsByType } = parseAlmanac(lines);
const locations = mapSeedsToLocations(seedNumbers, mapsByType);
const lowestLocation = locations.reduce(
  (lowestNumber, locationNumber) => (locationNumber < lowestNumber ? locationNumber : lowestNumber),
  Number.MAX_SAFE_INTEGER
);

console.log(lowestLocation);

function parseAlmanac(lines: string[]) {
  const [firstLine, , ...rest] = lines;
  const seedNumbers = parseSeedNumbers(firstLine);
  const mapsByType = parseAlmanacMapsByType(rest);

  return { seedNumbers, mapsByType };
}

function parseSeedNumbers(line: string) {
  const numbers = line
    .split(": ")[1]
    .split(" ")
    .map((number) => Number.parseInt(number));

  const pairs = new Array<[number, number]>();
  for (let index = 0; index < numbers.length; index += 2) {
    const rangeStart = numbers[index];
    const length = numbers[index + 1];
    pairs.push([rangeStart, length]);
  }

  return pairs.flatMap(([rangeStart, length]) => Array.from({ length }, (_, offset) => rangeStart + offset));
}

function parseAlmanacMapsByType(lines: string[]) {
  const mapsByType: AlmanacMap[][] = [];
  let maps: AlmanacMap[];

  lines.forEach((line, lineIndex) => {
    const isNewType = /^[a-z]/.test(line);
    const isAlmanacMap = /^\d/.test(line);
    const isNewLine = /^$/.test(line);
    const isLastLine = lineIndex === lines.length - 1;

    if (isNewType) {
      maps = [];
    }
    if (isAlmanacMap) {
      const [destinationNumber, sourceNumber, length] = line.split(" ").map((number) => Number.parseInt(number));
      maps.push({ destinationNumber, sourceNumber, length });
    }
    if (isNewLine || isLastLine) {
      mapsByType.push(maps);
    }
  });

  return mapsByType;
}

function mapSeedsToLocations(seedNumbers: number[], mapsByType: AlmanacMap[][]) {
  return seedNumbers.map((seedNumber: number) => mapSeedToLocation(seedNumber, mapsByType));
}

function mapSeedToLocation(seedNumber: number, mapsByType: AlmanacMap[][]) {
  let currentNumber = seedNumber;

  mapsByType.forEach((mapsForOneType) => {
    currentNumber = mapToNextType(currentNumber, mapsForOneType);
  });

  return currentNumber;
}

function mapToNextType(currentNumber: number, mapsForOneType: AlmanacMap[]) {
  for (const { sourceNumber, destinationNumber, length } of mapsForOneType) {
    if (sourceNumber <= currentNumber && currentNumber < sourceNumber + length) {
      const delta = currentNumber - sourceNumber;
      return destinationNumber + delta;
    }
  }

  return currentNumber;
}
