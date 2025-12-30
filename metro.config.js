
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for platform-specific extensions
config.resolver.sourceExts = [
  'ios.tsx',
  'ios.ts',
  'ios.jsx',
  'ios.js',
  'android.tsx',
  'android.ts',
  'android.jsx',
  'android.js',
  'native.tsx',
  'native.ts',
  'native.jsx',
  'native.js',
  ...config.resolver.sourceExts,
];

// Explicitly ignore problematic directories
config.resolver.blockList = [
  /babel-plugins\/.*/,
  /node_modules\/.*\/babel-plugins\/.*/,
];

// Configure watchman to ignore certain patterns
config.watchFolders = [__dirname];

// Enable package exports for better module resolution
config.resolver.unstable_enablePackageExports = true;

// Ensure proper asset resolution
config.resolver.assetExts = config.resolver.assetExts || [];

module.exports = config;
