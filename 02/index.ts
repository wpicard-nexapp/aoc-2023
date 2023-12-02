import { readFileSync } from "fs";
import { argv } from "process";

type Game = {
  id: number;
  draws: CubeGroup[][];
};

type CubeGroup = {
  count: number;
  color: string;
};

const fileName = argv[2];
const games = readFileSync(fileName, { encoding: "utf-8" }).split("\n").map(parseGame);

let result = 0;

for (const game of games) {
  const bag = calculateMinimalBagForGame(game);
  const bagPower = bag.red * bag.green * bag.blue;
  result += bagPower;
}

console.log(result);

function parseGame(line: string): Game {
  const gameRegex = /^Game (\d+): (.*)/;
  const [, id, rest] = line.match(gameRegex) ?? [];

  return {
    id: Number.parseInt(id),
    draws: parseDraws(rest),
  };
}

function parseDraws(draws: string) {
  return draws.trim().split(";").map(parseDraw);
}

function parseDraw(draw: string) {
  return draw.trim().split(",").map(parseCubeGroup);
}

function parseCubeGroup(cubeGroup: string) {
  const [count, color] = cubeGroup.trim().split(" ");

  return { count: Number.parseInt(count), color };
}

function calculateMinimalBagForGame({ draws }: Game) {
  const bag: Record<string, number> = {};

  for (const draw of draws) {
    for (const group of draw) {
      if (bag[group.color] < group.count || !bag[group.color]) {
        bag[group.color] = group.count;
      }
    }
  }

  return bag;
}
