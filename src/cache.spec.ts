import { callMemoized } from "./cache";

const sleep = (t: number): Promise<void> => new Promise((r) => setTimeout(r, t));

describe("cache", () => {

  test("getCookie() defined", async () => {
    const fn = (s1: string, s2?: number): string => {
      return s2 + " " + s1 + " " + Date.now();
    };

    const r1 = callMemoized(1000, fn, "hello", 12);
    await sleep(500);
    const r2 = callMemoized(1000, fn, "hello", 12);
    const r2a = callMemoized(1000, fn, "hello", 13);
    await sleep(600);
    const r3 = callMemoized(1000, fn, "hello", 12);
    const r3a = callMemoized(1000, fn, "hello", 13);

    expect(r1).toEqual(r2);
    expect(r1).not.toEqual(r3);
    expect(r1).not.toEqual(r2a);
    expect(r2a).toEqual(r3a);
  });
});
