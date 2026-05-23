module.exports = {
  preset: 'react-native',

  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@expo/vector-icons|@unimodules|unimodules|sentry-expo|native-base)/)',
  ],
};