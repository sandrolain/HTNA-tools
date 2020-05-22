import { getCookie } from "./cookie";

describe("cookie", () => {

  test("getCookie() defined", async () => {
    document.cookie = "foo=bar";
    const value = getCookie("foo");
    expect(value).toEqual("bar");
  });

  test("getCookie() undefined", async () => {
    const value = getCookie("undef");
    expect(value).toBeNull();
  });
});
