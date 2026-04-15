module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          // Disable reanimated plugin auto-inclusion. Hisab does NOT use
          // reanimated (only RN built-in Animated), and the plugin's
          // worklet transforms can trigger strict JSI type checks on
          // native side during init.
          "react-native-reanimated/plugin": false,
          reanimated: false,
        },
      ],
    ],
  };
};
