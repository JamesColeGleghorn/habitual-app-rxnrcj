
module.exports = function (api) {
  api.cache(true);
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@/components': './components',
            '@/hooks': './hooks',
            '@/utils': './utils',
            '@/styles': './styles',
            '@/types': './types',
            '@/constants': './constants',
            '@/contexts': './contexts',
          },
          extensions: [
            '.ios.tsx',
            '.ios.ts',
            '.ios.jsx',
            '.ios.js',
            '.android.tsx',
            '.android.ts',
            '.android.jsx',
            '.android.js',
            '.native.tsx',
            '.native.ts',
            '.native.jsx',
            '.native.js',
            '.tsx',
            '.ts',
            '.jsx',
            '.js',
            '.json',
          ],
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
