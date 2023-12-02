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

const bag: Record<string, number> = {
  red: 12,
  green: 13,
  blue: 14,
};

let result = 0;

for (const game of games) {
  if (gameIsPossible(game)) {
    result += game.id;
  }
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

function gameIsPossible({ draws }: Game) {
  return draws.every(drawIsPossible);
}

function drawIsPossible(draw: CubeGroup[]) {
  return draw.every((group) => group.count <= bag[group.color] ?? 0);
}
