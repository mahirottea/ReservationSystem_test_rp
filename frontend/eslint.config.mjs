import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // The following rules require full type information which isn't
    // enabled in this project. We disable them to avoid lint crashes
    // but keep them as warnings where useful.
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // allow gradual typing
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];

export default eslintConfig;

