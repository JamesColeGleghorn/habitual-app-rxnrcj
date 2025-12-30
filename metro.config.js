
const { getDefaultConfig } = require('expo/metro-config');

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

module.exports = config;
