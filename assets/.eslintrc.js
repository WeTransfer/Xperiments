module.exports = {
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "es6": true
  },
  "plugins": ["react"],
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "rules": {
    // Indendation and line-breaks
    "indent": [
      "error",
      2,
      { "SwitchCase": 1 },
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],

    // Be consistent when using quotes, and when using them, use single quotes.
    "quote-props": ["error", "consistent"],
    "quotes": [
      "error",
      "single"
    ],

    // Always end a line with a semicolon
    "semi": [
      "error",
      "always"
    ],

    // Functions are not appended with a space, keywords are
    "space-before-function-paren": [
      "error", 
      "never"
    ],
    "keyword-spacing": "error",

    // Use type-safe equality operators
    "eqeqeq": ["error", "always"],
    
    // Prevent typing useless code
    "no-unused-vars": "error",
    "no-else-return": "error",
    "no-empty-function": "error",
    "no-lone-blocks": "error",
    "no-lonely-if": "error",
    "no-multi-spaces": "error",
    "no-unused-expressions": ["error", { "allowShortCircuit": true }],
    "no-use-before-define": "error",
    "no-useless-constructor": "error",

    // Other styling rules
    "brace-style": "error",
    "comma-dangle": ["error", "never"],
    "no-alert": "error",
    "react/no-find-dom-node": "warn",
    
    // Only during development
    "no-console": ["off"]
  },
  "globals": {
    "__DEV__": true,
    "global": true
  }
};