module.exports = {
  env: {
    node: true,
    jest: true,
    es2022: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "prettier"
  ],
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    "no-console": "warn",
  }
}
