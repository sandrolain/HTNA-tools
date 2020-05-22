import { htmlEntities, htmlEntitiesDecode } from "./html";

describe("html", () => {

  test("htmlEntities()", async () => {
    const escaped = htmlEntities(` " ' & < > `);
    expect(escaped).toStrictEqual(` &quot; &#39; &amp; &lt; &gt; `);
  });

  test("htmlEntitiesDecode()", async () => {
    const decoded = htmlEntitiesDecode(` &quot; &#39; &amp; &lt; &gt; `);
    expect(decoded).toStrictEqual(` " ' & < > `);
  });

});
