import broilerplate, {
  pathsFromRootPath,
  addEntrypoint,
  build,
  setContext,
  addPlugin,
  createPluginDefinition,
  BroilerplateContext,
  RuleDefinition,
  addRule,
  whenProduction
} from "@dr-kobros/webpack-broilerplate";

import babel from "@dr-kobros/webpack-broilerplate/dist/features/babel";
import mjs from "@dr-kobros/webpack-broilerplate/dist/features/mjs";
// import CoreJSPlugin from "corejs-upgrade-webpack-plugin";

import images from "@dr-kobros/webpack-broilerplate/dist/features/images";
import html from "@dr-kobros/webpack-broilerplate/dist/features/html";
import copyFiles from "@dr-kobros/webpack-broilerplate/dist/features/copyFiles";
import saneDefaultOptions from "@dr-kobros/webpack-broilerplate/dist/features/saneDefaultOptions";
import emotion from "@dr-kobros/webpack-broilerplate-emotion";

import { pipe } from "ramda";
import path from "path";
import util from "util";

import MiniCssExtractPlugin from "mini-css-extract-plugin";

import pkg from "./package.json";

const mode =
  process.env.NODE_ENV === "development" ? "development" : "production";
const bp = broilerplate(mode, pathsFromRootPath(__dirname), {
  debug: true
});

const externalCSS = () => (bp: BroilerplateContext): BroilerplateContext => {
  const Plugin = new MiniCssExtractPlugin();

  const ruleset: RuleDefinition = {
    factory: () => {
      return {
        test: /\.css$/,
        use: [
          {
            loader:
              bp.mode === "production"
                ? MiniCssExtractPlugin.loader
                : "style-loader"
          },
          {
            loader: "css-loader"
          }
        ],
        include: [bp.paths.modules, bp.paths.src]
      };
    }
  };

  return pipe(
    whenProduction(addPlugin(createPluginDefinition(() => Plugin))),
    addRule(ruleset)
  )(bp);
};

/*
const coreJS = () =>
  addPlugin(
    createPluginDefinition(() => CoreJSPlugin({ resolveFrom: [process.cwd()] }))
  );
*/

const bp2 = pipe(
  saneDefaultOptions(),
  copyFiles("assets/web"),
  html({}),
  images(),
  setContext(path.resolve(__dirname, "./src")),
  addEntrypoint("client", "./client.tsx"),
  babel({ browsers: pkg.browserslist[mode] }),
  mjs(),
  // coreJS(),
  externalCSS(),
  emotion()
)(bp);
const config = build(bp2);

console.log(util.inspect(config, false, 999));

export default config;
