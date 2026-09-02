// Local Metro config so Expo does NOT pick up C:\Users\adity\metro.config.js
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// lucide-react-native publishes "react-native" → ESM .mjs; Metro often fails to
// resolve those icon files. Force the CJS build instead.
const lucideRoot = path.resolve(__dirname, "node_modules/lucide-react-native");

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "lucide-react-native") {
    return {
      type: "sourceFile",
      filePath: path.join(lucideRoot, "dist/cjs/lucide-react-native.js"),
    };
  }

  const iconMatch = /^lucide-react-native\/icons\/(.+)$/.exec(moduleName);
  if (iconMatch) {
    return {
      type: "sourceFile",
      filePath: path.join(lucideRoot, `dist/cjs/icons/${iconMatch[1]}.js`),
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
