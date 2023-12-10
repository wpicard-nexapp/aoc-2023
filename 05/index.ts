import { readFileSync } from "fs";
import { argv } from "process";
import { findLowestLocation } from "./worker";

export type AlmanacMap = {
  destinationNumber: number;
  sourceNumber: number;
  length: number;
};

export type SeedNumberRange = {
  rangeStart: number;
  length: number;
};

const fileName = argv[2];
const lines = readFileSync(fileName, { encoding: "utf-8" }).split("\n");
const { seedNumberRanges, mapsByType } = parseAlmanac(lines);

const promises = Array.from(seedNumberRanges, (range) => findLowestLocation(range, mapsByType));
const lowestLocations = await Promise.all(promises);
const lowestLocation = lowestLocations.reduce(
  (lowest, location) => (location < lowest ? location : lowest),
  Number.MAX_SAFE_INTEGER
);

console.log(lowestLocation);

function parseAlmanac(lines: string[]) {
  const [firstLine, , ...rest] = lines;
  const seedNumberRanges = parseSeedNumberRanges(firstLine);
  const mapsByType = parseAlmanacMapsByType(rest);

  return { seedNumberRanges, mapsByType };
}

function parseSeedNumberRanges(line: string) {
  const numbers = line
    .split(": ")[1]
    .split(" ")
    .map((number) => Number.parseInt(number));

  const ranges = new Array<SeedNumberRange>();
  for (let index = 0; index < numbers.length; index += 2) {
    const rangeStart = numbers[index];
    const length = numbers[index + 1];
    ranges.push({ rangeStart, length });
  }

  return ranges;
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
