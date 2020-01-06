const path = require("path");
const util = require("util");
const {
  pipe,
  empty,
  defaultFeatures,
  defaultPaths,
  defaultBaseConfig,
  mergeOptions,
  addFeatures,
  removeFeature,
  compile,
  override,
  setEntry,
  run,
  toJS
} = require("@dr-kobros/broilerplate");

const postCssFeature = require("@dr-kobros/broilerplate-postcss");
// const babelPolyfillFeature = require("@dr-kobros/broilerplate/lib/features/babelPolyfillFeature");
const nodeExternalsFeature = require("@dr-kobros/broilerplate/lib/features/nodeExternalsFeature");
const externalCssFeature = require("@dr-kobros/broilerplate/lib/features/externalCssFeature");
const manifestFeature = require("@dr-kobros/broilerplate/lib/features/manifestFeature");
const extractCssFeature = require("@dr-kobros/broilerplate-mini-css-extract");
const styledComponentsFeature = require("@dr-kobros/broilerplate-styled-components");
const swFeature = require("@dr-kobros/broilerplate-serviceworker");

const emotion = require("./src/config/emotion");
const upgrader = require("./src/config/corejs-upgrade");

const dotenv = require("dotenv");
dotenv.config();

const { Map } = require("immutable");

module.exports = target => {
  const env = process.env.NODE_ENV;

  const config = pipe(
    empty,
    defaultPaths(env, target, __dirname),
    defaultBaseConfig(env, target),
    mergeOptions(
      Map({
        debug: env === "development" ? true : false
      })
    ),
    setEntry("client", "./client.tsx"),
    defaultFeatures,
    removeFeature("environmentVariablesFeature"),
    addFeatures(
      [
        "environmentVariablesFeature",
        Map({
          filter: (v, k) => {
            const whitelisted = ["NODE_ENV", "COMMIT_REF"];

            return whitelisted.includes(k) || k.startsWith("REACT_APP_");
          }
        })
      ],
      swFeature(),
      manifestFeature(
        Map({
          seed: Map({
            name: "MHM 97",
            short_name: "MHM 97",
            start_url: "/",
            display: "standalone",
            background_color: "rgb(0, 0, 0)",
            theme_color: "rgb(0, 0, 0)",
            description: "MHM 97",
            icons: [
              {
                src: "icons/mhm97-48.png",
                sizes: "48x48",
                type: "image/png"
              },
              {
                src: "icons/mhm97-192.png",
                sizes: "192x192",
                type: "image/png"
              },
              {
                src: "icons/mhm97-512.png",
                sizes: "512x512",
                type: "image/png"
              }
            ]
          })
        })
      ),
      postCssFeature(),
      styledComponentsFeature(),
      // babelPolyfillFeature(),
      externalCssFeature(),
      extractCssFeature(),
      nodeExternalsFeature({
        whitelist: []
      }),
      emotion(),
      upgrader()
    ),
    build => {
      if (env === "production") {
        return build;
      }
      return build.setIn(["base", "devtool"], "cheap-module-eval-source-map");
    },
    // ensureFiles(false),
    compile(env, target),
    override(path.join(__dirname, "./src/config/overrides")),
    run,
    toJS
  )(Map());

  // console.log("config", util.inspect(config, { depth: 666 }));
  // process.exit();

  return config;
};
