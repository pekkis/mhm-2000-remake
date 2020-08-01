// import { pipe, over, lensPath, append } from "ramda";
import path from "path";
import util from "util";

import { any, pickBy, mapObjIndexed } from "ramda";
import { merge } from "webpack-merge";

// import MiniCssExtractPlugin from "mini-css-extract-plugin";

import pkg from "./package.json";
// import { Configuration } from "webpack-dev-server";

import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

import * as webpack from "webpack";
// import * as webpackDevServer from "webpack-dev-server";

import CopyWebpackPlugin from "copy-webpack-plugin";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import WatchMissingNodeModulesPlugin from "react-dev-utils/WatchMissingNodeModulesPlugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const hasPrefix = (prefixes: string[], value: string): boolean => {
  return any((p) => value.startsWith(p), prefixes);
};

const getEnvironmentVariables = (
  env: NodeJS.ProcessEnv,
  prefix: string[],
  whitelisted: string[]
): { [key: string]: string } => {
  // console.log(env, "env");

  const picked = pickBy(
    (v, k) =>
      k === "NODE_ENV" || whitelisted.includes(v) || hasPrefix(prefix, k),
    env
  );

  return mapObjIndexed((v) => {
    return JSON.stringify(v);
  }, picked);
};

const getBundleAnalyzer = (mode: string) => {
  const options: BundleAnalyzerPlugin.Options =
    mode === "development"
      ? {}
      : {
          analyzerMode: "disabled",
          generateStatsFile: true,
          statsFilename: "stats.json",
        };

  const p = new BundleAnalyzerPlugin(options);
  return p;
};

const mode =
  process.env.NODE_ENV === "development" ? "development" : "production";

const c: webpack.Configuration = {
  mode,
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  devtool: false,
  output: {
    publicPath: "/",
  },
  devServer: {
    port: 11000,
    hot: true,
    index: "index.html",
    disableHostCheck: true,
    historyApiFallback: true,
  },
  resolve: {
    modules: [path.resolve("node_modules")],
    extensions: [".js", ".ts", ".jsx", ".tsx", ".mjs"],
  },
  context: path.resolve("src"),
  entry: { client: "./client.tsx" },
  plugins: [
    new webpack.DefinePlugin({
      __DEVELOPMENT__: mode === "development",
      __PRODUCTION__: mode === "production",
      "process.env": getEnvironmentVariables(process.env, ["REACT_APP_"], []),
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "assets/web", flatten: false }],
    }),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(path.resolve("node_modules")),
    new HtmlWebpackPlugin({
      template: "assets/index.html",
      favicon: "assets/index.html",
      chunksSortMode: "auto",
      title: "MHM 2000",
    }),
    getBundleAnalyzer(mode),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|ico|svg)$/,
        include: [path.resolve("src")],
        use: [
          {
            loader: "file-loader",
            options: { name: "[path][name]-[hash].[ext]", emitFile: true },
          },
          {
            loader: "image-webpack-loader",
            options: { disabled: mode !== "production" },
          },
        ],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              babelrc: false,
              presets: [
                "@babel/preset-typescript",
                [
                  "@babel/preset-env",
                  {
                    debug: true,
                    useBuiltIns: "usage",
                    targets: {
                      browsers: pkg.browserslist[mode],
                    },
                    modules: false,
                    corejs: 3,
                  },
                ],
                ["@babel/preset-react", { development: true }],
                "@emotion/babel-preset-css-prop",
              ],
              plugins: [
                "@babel/plugin-syntax-dynamic-import",
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-nullish-coalescing-operator",
                "@babel/plugin-proposal-optional-chaining",
              ],
              cacheDirectory: true,
            },
          },
        ],
        exclude: [path.resolve("node_modules")],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
    ],
  },
};

const p: webpack.Configuration = {
  output: {
    filename: "[name].[contenthash].js",
  },
};

const f = mode === "production" ? merge(c, p) : c;

console.log(util.inspect(f, false, 999));

export default f;

// process.exit();

// export default withBundleAnalyzer;
