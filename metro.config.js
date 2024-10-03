const { getDefaultConfig } = require("@react-native/metro-config");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 */

const defaultConfig = getDefaultConfig("expo"); // Change 'expo' to your project's configuration if needed

const config = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    assetExts: defaultConfig.resolver.assetExts
      .filter((ext) => ext !== "svg")
      .concat(["glb", "gltf", "mtl", "obj", "png", "jpg"]),
    sourceExts: [
      ...defaultConfig.resolver.sourceExts,
      "js",
      "jsx",
      "json",
      "ts",
      "tsx",
    ],
  },
};

module.exports = config;
