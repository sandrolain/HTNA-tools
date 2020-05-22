import { getPathMatcher, getPathParamsApplier } from "./url";

describe("url", () => {

  test("getPathMatcher() valid", async () => {
    const matcher = getPathMatcher("/testPath/:name");
    const res = matcher("/testPath/foo");
    expect(res).not.toBeFalsy();
    expect(res).toEqual({
      name: "foo"
    });
  });

  test("getPathMatcher() invalid path", async () => {
    const matcher = getPathMatcher("/testPath/:name");
    const res = matcher("/anotherPath/foo");
    expect(res).toBeFalsy();
  });

  test("getPathMatcher() invalid subpath", async () => {
    const matcher = getPathMatcher("/testPath/:name");
    const res = matcher("/testPath/foo/bar");
    expect(res).toBeFalsy();
  });

  test("getPathMatcher() invalid case", async () => {
    const matcher = getPathMatcher("/testPath/:name");
    const res = matcher("/testpath/foo");
    expect(res).toBeFalsy();
  });

  test("getPathMatcher() valid case-insensitive", async () => {
    const matcher = getPathMatcher("/testPath/:name", true);
    const res = matcher("/testpath/foo");
    expect(res).not.toBeFalsy();
    expect(res).toEqual({
      name: "foo"
    });
  });

  test("getPathMatcher() valid multiple arguments", async () => {
    const matcher = getPathMatcher("/testPath/:name/:surname");
    const res = matcher("/testPath/foo/bar");
    expect(res).not.toBeFalsy();
    expect(res).toEqual({
      name: "foo",
      surname: "bar"
    });
  });

  test("getPathMatcher() without arguments", async () => {
    const matcher = getPathMatcher("/testPath/noArgs");
    const res = matcher("/testPath/noArgs");
    expect(res).not.toBeFalsy();
    expect(res).toEqual({});
  });

  test("getPathMatcher() case-insensitive without arguments", async () => {
    const matcher = getPathMatcher("/testPath/noArgs", true);
    const res = matcher("/testpath/noArgs");
    expect(res).not.toBeFalsy();
    expect(res).toEqual({});
  });

  test("getPathParamsApplier()", async () => {
    const applier = getPathParamsApplier("/testPath/:name/:surname");
    const res = applier({
      name: "foo",
      surname: "bar"
    });
    expect(res).toEqual("/testPath/foo/bar");
  });

  test("getPathParamsApplier() without arguments", async () => {
    const applier = getPathParamsApplier("/testPath/noArgs");
    const res = applier({
      name: "foo",
      surname: "bar"
    });
    expect(res).toEqual("/testPath/noArgs");
  });

});
