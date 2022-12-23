module.exports = {
  root: true,
  extends: ['standard', 'react-app'],
  plugins: [],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  ignorePatterns: ['build/static/**'],
  rules: {
    'no-underscore-dangle': 'off',
    semi: 'off'
  }
};
