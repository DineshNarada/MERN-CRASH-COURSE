import { FlatCompat } from "eslint-define-config";

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended"),
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    rules: {
      // Customize your rules here
      "react/react-in-jsx-scope": "off", // Not needed with React 17+
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
