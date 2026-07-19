import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js",
  output: {
    file: "dist/rack-monitor-card.js",
    format: "es",
    sourcemap: false,
  },
  plugins: [nodeResolve(), terser({ format: { comments: false } })],
};
