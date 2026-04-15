// CommonJS require() — NOT ES import — because ES imports are hoisted
// by the bundler. We need enableScreens(false) to run BEFORE any
// expo-router / react-native-screens code initialises the native module.
const { enableScreens } = require("react-native-screens");
enableScreens(false);
require("expo-router/entry");
