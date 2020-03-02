import broilerplate, {
  pathsFromRootPath,
  addEntrypoint,
  build,
  setContext
} from "@dr-kobros/webpack-broilerplate";

import babel from "@dr-kobros/webpack-broilerplate/dist/features/babel";
import mjs from "@dr-kobros/webpack-broilerplate/dist/features/mjs";
// import CoreJSPlugin from "corejs-upgrade-webpack-plugin";

import images from "@dr-kobros/webpack-broilerplate/dist/features/images";
import html from "@dr-kobros/webpack-broilerplate/dist/features/html";
import copyFiles from "@dr-kobros/webpack-broilerplate/dist/features/copyFiles";
import saneDefaultOptions from "@dr-kobros/webpack-broilerplate/dist/features/saneDefaultOptions";
import emotion from "@dr-kobros/webpack-broilerplate-emotion";

import { pipe, over, lensPath, append } from "ramda";
import path from "path";
import util from "util";

// import MiniCssExtractPlugin from "mini-css-extract-plugin";

import pkg from "./package.json";
import { Configuration } from "webpack-dev-server";

import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const addBundleAnalyzer = (config: Configuration, mode: string) => {
  const options: BundleAnalyzerPlugin.Options =
    mode === "development"
      ? {}
      : {
          analyzerMode: "disabled",
          generateStatsFile: true,
          statsFilename: "stats.json"
        };

  const p = new BundleAnalyzerPlugin(options);
  return over(lensPath(["plugins"]), append(p), config);
};

const mode =
  process.env.NODE_ENV === "development" ? "development" : "production";
const bp = broilerplate(mode, pathsFromRootPath(__dirname), {
  debug: true
});

/*
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
*/

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
  // externalCSS(),
  emotion()
)(bp);
const config = build(bp2);

const config2 = config;

/*
const config2 = over(
  lensPath(["module", "rules", 1, "exclude", 0]),
  () => {
    return /node_modules\/(?!react-country-flags)/;
  },
  config
);
*/

if (config2.output) {
  config2.output.publicPath = "/";
} else {
  config2.output = {
    publicPath: "/"
  };
}

config2.devServer = {
  port: 11000,
  hot: true,
  index: "index.html",
  disableHostCheck: true,
  historyApiFallback: true
};

const config3 = over(
  lensPath(["module", "rules", 1, "use", 0, "options"]),
  options => {
    return {
      ...options,
      cacheDirectory: true
    };
  },
  config2
);

const withBundleAnalyzer = addBundleAnalyzer(config3, mode);

console.log(util.inspect(withBundleAnalyzer, false, 999));

export default withBundleAnalyzer;
