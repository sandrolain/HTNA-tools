import { htmlEntities } from "./html";

describe("html", () => {

  test("htmlEntities()", async () => {
    const escaped = htmlEntities(` " ' & < > `);
    expect(escaped).toStrictEqual(` &quot; &#39; &amp; &lt; &gt; `);
  });

});
