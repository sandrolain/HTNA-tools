import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/umd/index.js",
      format: "umd",
      name: "fancyCase",
      esModule: false,
      sourcemap: true
    },
    plugins: [
      typescript({
        typescript: require("typescript")
      }),
      terser()
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
      string: "src/string.ts"
    },
    output: [
      {
        dir: "./dist/cjs",
        format: "cjs",
        sourcemap: true
      },
      {
        dir: "./dist/esm",
        format: "esm",
        sourcemap: true
      }
    ],
    plugins: [
      typescript({
        typescript: require("typescript")
      }),
      resolve()
    ]
  }
];
