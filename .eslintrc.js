module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true
  },
  extends: ["react-app", "plugin:prettier/recommended", "plugin:jsx-a11y/recommended"],
  plugins: ["emotion", "jsx-a11y"],
  parser: "babel-eslint"
};
