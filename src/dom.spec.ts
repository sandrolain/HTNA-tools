import { createElement } from "./dom";

describe("dom", () => {

  test("createElement() simple", async () => {
    const node = createElement("div");
    expect(node).toBeInstanceOf(HTMLElement);
    expect(node.outerHTML).toEqual("<div></div>");
  });

  test("createElement() with attributes", async () => {
    const node = createElement("div", {
      style: "border: 1px solid #FF0000; padding: 1em",
      title: "My new div element"
    });
    expect(node).toBeInstanceOf(HTMLElement);
    expect(node.outerHTML).toEqual(`<div style="border: 1px solid #FF0000; padding: 1em" title="My new div element"></div>`);
  });

  test("createElement() with children", async () => {
    const node = createElement("div", null, [
      "Simple text and",
      createElement("br"),
      createElement("strong", null, ["Bold text"])
    ]);
    expect(node).toBeInstanceOf(HTMLElement);
    expect(node.outerHTML).toEqual(`<div>Simple text and<br><strong>Bold text</strong></div>`);
  });

  test("createElement() with attributes and children", async () => {
    const node = createElement("div", {
      style: "border: 1px solid #FF0000; padding: 1em",
      title: "My new div element"
    }, [
      "Simple text and",
      createElement("br"),
      ["strong", null, ["Bold text"]]
    ]);
    expect(node).toBeInstanceOf(HTMLElement);
    expect(node.outerHTML).toEqual(`<div style="border: 1px solid #FF0000; padding: 1em" title="My new div element">Simple text and<br><strong>Bold text</strong></div>`);
  });

});
