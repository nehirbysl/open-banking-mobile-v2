module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo (SDK 51) bundles the expo-router plugin, so no need
    // to add it explicitly here.
    presets: ["babel-preset-expo"],
    plugins: [
      // react-native-reanimated/plugin must be last in the list.
      "react-native-reanimated/plugin",
    ],
  };
};
