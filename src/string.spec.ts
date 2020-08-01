import { compareVersionStrings } from "./string";

describe("script", () => {

  test("compareVersionStrings() equals", async () => {
    const result = compareVersionStrings("1.0.0", "1.0.0");
    expect(result).toEqual(0);
  });

  test("compareVersionStrings() equals with different specificity", async () => {
    const result = compareVersionStrings("1.0.0", "1.0");
    expect(result).toEqual(0);
  });

  test("compareVersionStrings() differs with different specificity", async () => {
    const result = compareVersionStrings("1.0.1", "1.0");
    expect(result).toBeGreaterThan(0);
  });

  test("compareVersionStrings() first is older major", async () => {
    const result = compareVersionStrings("1.0.0", "2.0.0");
    expect(result).toBeLessThan(0);
  });

  test("compareVersionStrings() first is older minor", async () => {
    const result = compareVersionStrings("1.0.0", "1.5.0");
    expect(result).toBeLessThan(0);
  });

  test("compareVersionStrings() first is newer major", async () => {
    const result = compareVersionStrings("3.0.0", "1.0.0");
    expect(result).toBeGreaterThan(0);
  });

  test("compareVersionStrings() first is newer minor", async () => {
    const result = compareVersionStrings("1.2.0", "1.0.0");
    expect(result).toBeGreaterThan(0);
  });

  test("compareVersionStrings() first is newer minor", async () => {
    const result = compareVersionStrings("1.2.0", "1.0.0");
    expect(result).toBeGreaterThan(0);
  });

  test("compareVersionStrings() non-number equals to 0", async () => {
    const result = compareVersionStrings("1.0.A", "1.0.0");
    expect(result).toEqual(0);
  });

});
