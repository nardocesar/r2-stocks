import { merge } from "webpack-merge";
import common from "./webpack.config.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(common, {
  mode: "development",
  output: {
    filename: "stocks.bundle.js",
    library: {
      name: "StocksSnapshot",
      type: "umd",
      export: "default",
    },
    globalObject: "this",
  },
  devtool: "eval-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "demo"),
    },
    port: 3000,
    hot: true,
    open: true,
    compress: true,
  },
});
