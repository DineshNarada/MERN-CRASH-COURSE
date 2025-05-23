// Converted from .eslintrc.js to flat config format for ESLint v9+

export default [
  {
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Not needed with React 17+
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["*.js", "*.jsx"],
  },
];
