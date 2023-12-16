import { describe, expect, test } from "bun:test";
import { calculateTypeValue } from "./module";

describe("calculateTypeValue", () => {
  describe("With no Joker", () => {
    const cases = [
      ["12345", 0],
      ["11234", 1],
      ["11223", 2],
      ["11123", 3],
      ["11122", 4],
      ["11112", 5],
      ["11111", 6],
    ] as const;

    test.each(cases)("The type value of %s should be %d", (cards, expectedTypeValue) => {
      expect(calculateTypeValue(cards)).toEqual(expectedTypeValue);
    });
  });

  describe("With one Joker", () => {
    const cases = [
      ["J1234", 1],
      ["J1223", 3],
      ["J1123", 3],
      ["J1122", 4],
      ["J1112", 5],
      ["J1111", 6],
    ] as const;

    test.each(cases)("The type value of %s should be %d", (cards, expectedTypeValue) => {
      expect(calculateTypeValue(cards)).toEqual(expectedTypeValue);
    });
  });

  describe("With two Jokers", () => {
    const cases = [
      ["JJ123", 3],
      ["JJ112", 5],
      ["JJ111", 6],
    ] as const;

    test.each(cases)("The type value of %s should be %d", (cards, expectedTypeValue) => {
      expect(calculateTypeValue(cards)).toEqual(expectedTypeValue);
    });
  });
});
