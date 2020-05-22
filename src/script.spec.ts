import { executeSourceWithArguments } from "./script";

describe("script", () => {

  test("executeSourceWithArguments() simple", async () => {
    const result = executeSourceWithArguments(`
      return foo * bar;
    `, new Map([
      ["foo", 16],
      ["bar", 2]
    ]));
    expect(result).toEqual(32);
  });

  test("executeSourceWithArguments() complex", async () => {
    const result = executeSourceWithArguments(`
      return new Date(time.value);
    `, new Map([
      ["time", { value: "2020-01-01T18:15:30.123Z" }]
    ]));
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toEqual("2020-01-01T18:15:30.123Z");
  });

  test("executeSourceWithArguments() invalid variable", async () => {
    let error: Error = null;
    try {
      executeSourceWithArguments(`
        return foo;
      `, new Map([
        ["bar", 123]
      ]));
    } catch(e) {
      error = e;
    }
    expect(error).toBeInstanceOf(Error);
  });

});
