const loaderOverrides = {
  babelLoader: (loader, env, target, paths) => {
    return loader;
  }
};

const pluginOverrides = {
  /*
  manifestPlugin: (plugin, env, target, paths) => {
    return {
      ...plugin,
      options: (env, target, paths, options) =>
        plugin.options(env, target, paths, options).setIn(
          [0, "seed"],
          Map({
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
        )
    };
  }
  */
};

const overrideLoader = (loader, env, target, paths) => {
  return loaderOverrides[loader.name()]
    ? loaderOverrides[loader.name()](loader, env, target, paths)
    : loader;
};

const overridePlugin = (plugin, env, target, paths) => {
  return pluginOverrides[plugin.name()]
    ? pluginOverrides[plugin.name()](plugin, env, target, paths)
    : plugin;
};

const overrideBase = (base, env, target, paths) => {
  return base;
};

module.exports = {
  overrideLoader,
  overridePlugin,
  overrideBase
};
