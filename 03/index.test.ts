import { readFileSync } from "fs";
import { describe, expect, test } from "bun:test";

const fileName = "./data/input.txt";
const data = readFileSync(fileName, { encoding: "utf-8" });

test("These are the unique chars from the input", () => {
  const uniqueChar = new Set<string>();

  for (const char of data) {
    uniqueChar.add(char);
  }

  console.log([...uniqueChar].sort());
});

describe("The symbol regex finds all symbols from the input", () => {
  const symbols = ["#", "$", "%", "&", "*", "+", "-", "/", "=", "@"];
  const symbolRegex = /[^\d.]/;

  test.each(symbols)("The symbol regex can match %s", (symbol) => {
    expect(symbolRegex.test(symbol)).toBeTrue();
  });
});

describe("911*90", () => {});

describe("161 at end of line", () => {});
