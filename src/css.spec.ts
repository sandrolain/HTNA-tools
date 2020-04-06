/**
 * @jest-environment jsdom
 */

import { fetchStyleImports } from "./css";

const importString = "@import url('./path/substyle.css');";

const baseStyleUrl = "https://www.example.com/style.css";
const baseStyle = `
${importString}

.selector {
  color: #FF0000;
}
`;

const importStyleUrl = "https://www.example.com/path/substyle.css";
const importStyle = `
.selector2 {
  color: #FF0000;
}
`;

const fullStyle = baseStyle.replace(importString, importStyle);

describe("tools", () => {

  beforeAll(() => {
    (global as any).fetch = jest.fn((url) => {
      if(url === baseStyleUrl) {
        return Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(baseStyle)
        });
      } else if(url === importStyleUrl) {
        return Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(importStyle)
        });
      } else {
        return Promise.resolve({
          ok: false,
          status: 404
        });
      }
    });
  });

  it("fetchStyleImports()", async () => {
    const result = await fetchStyleImports(baseStyleUrl);
    expect(result).toStrictEqual(fullStyle);
  });

});
