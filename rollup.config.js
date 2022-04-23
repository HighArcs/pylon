import typescript from "@rollup/plugin-typescript";
import dotenv from "dotenv";
dotenv.config();
export default {
  input: "src/main.ts",
  output: {
    file: process.env.BUNDLE || "dist/bundle.js",
    format: "cjs",
  },
  plugins: [typescript({ target: "es2020" })],
};
