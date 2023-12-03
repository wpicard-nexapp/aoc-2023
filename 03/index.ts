import { argv } from "process";
import { readFileSync } from "fs";

const fileName = argv[2];
const lines = readFileSync(fileName, { encoding: "utf-8" }).split("\n");

type Position = Readonly<{ x: number; y: number }>;
type PartNumber = {
  value: number;
  positions: Position[];
};

class PartNumberMapping {
  readonly mapping = new Map<string, PartNumber>();

  public getPartNumberAt({ x, y }: Position) {
    return this.mapping.get(`${x}:${y}`);
  }

  public setPartNumberAt({ x, y }: Position, partNumber: PartNumber) {
    this.mapping.set(`${x}:${y}`, partNumber);
  }
}

const { partNumberMapping, symbolPositions } = parseEngineSchematic(lines);
const adjacentPartNumber = findAdjacentPartNumber(partNumberMapping, symbolPositions);
const result = adjacentPartNumber.reduce((sum, { value }) => sum + value, 0);

console.log(result);

function parseEngineSchematic(lines: string[]) {
  const partNumberMapping = new PartNumberMapping();
  const symbolPositions = new Array<Position>();

  for (let y = 0; y < lines.length; y++) {
    let partNumberValue = "";
    let partNumberPositions = new Array<Position>();

    for (let x = 0; x < lines[y].length; x++) {
      const char = lines[y][x];

      const isSymbol = /[^\d.]/.test(char);
      const isNumber = /\d/.test(char);

      if (isSymbol) {
        symbolPositions.push({ x, y });
      }

      if (isNumber) {
        partNumberValue += char;
        partNumberPositions.push({ x, y });
      } else if (partNumberValue.length > 0) {
        const partNumber: PartNumber = {
          value: Number.parseInt(partNumberValue),
          positions: partNumberPositions,
        };
        partNumberPositions.forEach((position) => {
          partNumberMapping.setPartNumberAt(position, partNumber);
        });
        partNumberValue = "";
        partNumberPositions = [];
      }
    }
  }

  return { partNumberMapping, symbolPositions };
}

function findAdjacentPartNumber(partNumberMapping: PartNumberMapping, symbolPositions: ReadonlyArray<Position>) {
  const adjacentPartNumber = new Set<PartNumber>();

  symbolPositions.forEach((position) => {
    for (let x = position.x - 1; x <= position.x + 1; x++) {
      for (let y = position.y - 1; y <= position.y + 1; y++) {
        const partNumber = partNumberMapping.getPartNumberAt({ x, y });
        if (partNumber) {
          adjacentPartNumber.add(partNumber);
        }
      }
    }
  });

  return [...adjacentPartNumber];
}
