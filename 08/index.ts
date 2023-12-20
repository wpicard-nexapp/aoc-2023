import { readFileSync } from "fs";
import { argv } from "process";

type Node = {
  left: string;
  right: string;
};
type Graph = Map<string, Node>;
type Instruction = keyof Node;

const fileName = argv[2];
const lines = readFileSync(fileName, { encoding: "utf-8" }).split("\n");
const instructions = parseInstructions(lines[0]);
const graph = parseGraph(lines.slice(2));

const steps = walk(instructions, graph);

console.log(steps);

function parseInstructions(line: string): Instruction[] {
  return line.split("").map(parseInstruction);
}

function parseInstruction(char: string): Instruction {
  switch (char) {
    case "L":
      return "left";
    case "R":
      return "right";
  }

  throw new Error(`"${char}" is not a valid Instruction`);
}

function parseGraph(lines: string[]): Graph {
  return new Map(lines.map(parseNode));
}

function parseNode(line: string): [string, Node] {
  const [_, node, left, right] =
    line.match(/(\w\w\w) = \((\w\w\w), (\w\w\w)\)/) ?? throwError(`"${line}" is not a valide Node`);

  return [
    node,
    {
      left,
      right,
    },
  ];
}

function walk(instructions: Instruction[], graph: Graph): number {
  let currentNode = "AAA";
  const finalNode = "ZZZ";
  let steps = 0;

  while (currentNode !== finalNode) {
    const currentInstruction = instructions[steps % instructions.length];
    currentNode = graph.get(currentNode)?.[currentInstruction] ?? throwError(`Couldn't find node ${currentNode}`);
    steps++;
  }

  return steps;
}

function throwError(msg: string): never {
  throw new Error(msg);
}
