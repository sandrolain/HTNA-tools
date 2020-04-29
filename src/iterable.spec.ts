import { forEach } from "./iterable";

describe("iterable", () => {

  test("forEach() array", async () => {
    let total = 0;
    const data = ["a", 2, {}];
    forEach(data, (value, key) => {
      expect(value).toStrictEqual(data[key]);
      total++;
    });
    expect(total).toStrictEqual(total);
  });

  test("forEach() Map", async () => {
    let total = 0;
    const data = new Map([
      ["one", 1],
      ["two", 2],
      ["three", 3]
    ]);
    forEach(data, (value, key) => {
      expect(value).toStrictEqual(data.get(key));
      total++;
    });
    expect(total).toStrictEqual(data.size);
  });

  test("forEach() Set", async () => {
    let total = 0;
    const data = new Set([
      ["one"],
      ["two"],
      ["three"]
    ]);
    forEach(data, (value, key) => {
      expect(data.values()).toContain(value);
      expect(data.keys()).toContain(key);
      total++;
    });
    expect(total).toStrictEqual(data.size);
  });

  test("forEach() Object", async () => {
    let total = 0;
    const data: {[key: string]: number} = {
      one: 1,
      two: 2,
      three: 3
    };
    forEach(data, (value, key: string) => {
      expect(value).toStrictEqual(data[key]);
      total++;
    });
    expect(total).toStrictEqual(Object.keys(data).length);
  });

  test("forEach() empty value", async () => {
    let total = 0;
    forEach(null, () => {
      total++;
      throw new Error("Should not iterate");
    });
    expect(total).toStrictEqual(0);
  });
});
