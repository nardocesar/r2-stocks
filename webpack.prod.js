import { merge } from "webpack-merge";
import common from "./webpack.config.js";
import TerserPlugin from "terser-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";

export default merge(common, {
  mode: "production",
  output: {
    filename: "stocks.bundle.js",
    library: {
      name: "StocksSnapshot",
      type: "umd",
      export: "default",
    },
    globalObject: "this",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            passes: 2,
          },
          mangle: true,
        },
      }),
    ],
    splitChunks: {
      chunks: "async",
      cacheGroups: {
        sparkline: {
          test: /[\\/]features[\\/]Sparkline/,
          name: "sparkline",
          chunks: "async",
          priority: 10,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "async",
          priority: 5,
        },
      },
    },
    usedExports: true,
    sideEffects: false,
  },
  plugins: [
    new CompressionPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
  ],
  devtool: "source-map",
});
