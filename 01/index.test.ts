// import { describe, expect, test } from "bun:test";
// import { parseLine } from ".";

// describe("parseLine", () => {
//   function testParseLine(line: string, expected: string) {
//     const actual = parseLine(line);

//     expect(actual).toEqual(expected);
//   }

//   describe("When parse basic numbers, then return them as integer characters", () => {
//     test.each([["onetwothree", "123"]])(
//       "When parse %s, then return %s",
//       testParseLine
//     );
//   });

//   describe("When parse frankeinstein number, then return them as separate integer characters", () => {
//     test.each([
//       ["twone", "21"],
//       ["eightwothree", "823"],
//     ])("When parse %s, then return %s", testParseLine);
//   });
// });
