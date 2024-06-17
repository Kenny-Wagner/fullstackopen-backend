import globals from "globals";
import stylistic from '@stylistic/eslint-plugin-js';

export default [
  {
    ignores: ['dist/**'], 
  },
  {
    files: ["**/*.js"],
    languageOptions: { 
      sourceType: "commonjs",
      globals: globals.browser
     },
    plugins: {
      '@stylistic/js': stylistic,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      'eqeqeq': ['error'],
    },
  },
];
