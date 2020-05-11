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
      cookie: "src/cookie.ts",
      css: "src/css.ts",
      dom: "src/dom.ts",
      netw: "src/netw.ts",
      iterable: "src/iterable.ts",
      string: "src/string.ts",
      html: "src/html.ts",
      load: "src/load.ts",
      object: "src/object.ts",
      array: "src/array.ts",
      file: "src/file.ts",
      form: "src/form.ts",
      regexp: "src/regexp.ts",
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
