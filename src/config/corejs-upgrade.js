const {
  createFeature,
  createPlugin
} = require("@dr-kobros/broilerplate/lib/extend");
const { List, Map } = require("immutable");

const CoreJSUpgradeWebpackPlugin = require("corejs-upgrade-webpack-plugin")
  .default;

const plugin = config =>
  createPlugin(CoreJSUpgradeWebpackPlugin)({
    name: () => "coreJSUpgradePlugin",
    isEnabled: env => true,
    options: (env, target, paths) =>
      List.of(
        Map({
          resolveFrom: paths.get("root")
        })
      )
  });

module.exports = config =>
  createFeature({
    name: () => "coreJSUpgradeFeature",
    plugins: () => {
      return List.of(plugin());
    }
  });
