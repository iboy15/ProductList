// babel.config.js
module.exports = {
  presets: [
    '@babel/preset-typescript', // Add TypeScript support
    'module:@react-native/babel-preset',
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'], // Base directory for your source files
        alias: {
          // Define your custom aliases here
          '@components': './src/components',
          '@screens': './src/screens',
          '@types': './src/types',
          '@themes': './src/themes',
          '@utils': './src/utils',
          '@data': './src/data',
          '@context': './src/context',
          '@store': './src/store',
          '@assets': '/src/assets'
        },
      },
    ],
    [
      'module:react-native-dotenv', // Add this plugin
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};
