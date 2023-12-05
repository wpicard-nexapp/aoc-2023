import { argv } from "process";
import { readFileSync } from "fs";

const fileName = argv[2];
const lines = readFileSync(fileName, { encoding: "utf-8" }).split("\n");

type Position = Readonly<{ x: number; y: number }>;
type PartNumber = {
  value: number;
};

class PartNumberMapping {
  private mapping = new Map<string, PartNumber>();

  public getPartNumberAt({ x, y }: Position) {
    return this.mapping.get(`${x}:${y}`);
  }

  public setPartNumberAt({ x, y }: Position, partNumber: PartNumber) {
    this.mapping.set(`${x}:${y}`, partNumber);
  }
}

const { partNumberMapping, gearCandidatePositions } = parseEngineSchematic(lines);
const gearRatios = findAllGearRatios(partNumberMapping, gearCandidatePositions);
const result = gearRatios.reduce((sum, value) => sum + value, 0);

console.log(result);

function parseEngineSchematic(lines: string[]) {
  const partNumberMapping = new PartNumberMapping();
  const gearCandidatePositions = new Array<Position>();

  for (let y = 0; y < lines.length; y++) {
    let partNumberValue = "";
    let partNumberPositions = new Array<Position>();

    for (let x = 0; x < lines[y].length; x++) {
      const char = lines[y][x];

      const isGearCandidate = /\*/.test(char);
      const isNumber = /\d/.test(char);

      if (isGearCandidate) {
        gearCandidatePositions.push({ x, y });
      }

      if (isNumber) {
        partNumberValue += char;
        partNumberPositions.push({ x, y });
      }

      if ((!isNumber && partNumberValue.length > 0) || (isNumber && x === lines[y].length - 1)) {
        const partNumber: PartNumber = {
          value: Number.parseInt(partNumberValue),
        };
        partNumberPositions.forEach((position) => {
          partNumberMapping.setPartNumberAt(position, partNumber);
        });
        partNumberValue = "";
        partNumberPositions = [];
      }
    }
  }

  return { partNumberMapping, gearCandidatePositions };
}

function findAllGearRatios(
  partNumberMapping: PartNumberMapping,
  gearCandidatePositions: ReadonlyArray<Position>
): number[] {
  const gearRatios = new Array<number>();

  gearCandidatePositions.forEach((position) => {
    const adjacentPartNumbers = getAdjacentPartNumbers(partNumberMapping, position);

    if (adjacentPartNumbers.size === 2) {
      const [{ value: number1 }, { value: number2 }] = [...adjacentPartNumbers];
      gearRatios.push(number1 * number2);
    }
  });

  return gearRatios;
}

function getAdjacentPartNumbers(partNumberMapping: PartNumberMapping, position: Position) {
  const adjacentPartNumbers = new Set<PartNumber>();

  for (let x = position.x - 1; x <= position.x + 1; x++) {
    for (let y = position.y - 1; y <= position.y + 1; y++) {
      const partNumber = partNumberMapping.getPartNumberAt({ x, y });
      if (partNumber) {
        adjacentPartNumbers.add(partNumber);
      }
    }
  }

  return adjacentPartNumbers;
}
