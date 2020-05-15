import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import del from "rollup-plugin-delete";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/umd/index.js",
      format: "umd",
      name: "webTools",
      esModule: false,
      sourcemap: true
    },
    plugins: [
      del({
        targets: ["./dist/umd/*"]
      }),
      typescript({
        typescript: require("typescript")
      }),
      terser({
        output: {
          comments: false
        }
      })
    ]
  },
  {
    input: {
      index: "src/index.ts",
      // single
      array: "src/array.ts",
      color: "src/color.ts",
      cookie: "src/cookie.ts",
      css: "src/css.ts",
      dom: "src/dom.ts",
      file: "src/file.ts",
      form: "src/form.ts",
      html: "src/html.ts",
      iterable: "src/iterable.ts",
      load: "src/load.ts",
      netw: "src/netw.ts",
      number: "src/number.ts",
      object: "src/object.ts",
      regexp: "src/regexp.ts",
      script: "src/script.ts",
      string: "src/string.ts",
      worker: "src/worker.ts"
    },
    output: [
      {
        dir: "./dist/esm",
        format: "esm",
        sourcemap: true
      }
    ],
    plugins: [
      del({
        targets: ["./dist/esm/*"]
      }),
      typescript({
        typescript: require("typescript")
      }),
      resolve(),
      terser({
        output: {
          comments: false
        }
      })
    ]
  }
];
