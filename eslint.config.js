import eslintPluginAstro from 'eslint-plugin-astro'
import tseslint from 'typescript-eslint'
import tailwind from 'eslint-plugin-tailwindcss'

export default [
  // 1. 引入 TypeScript 推荐配置
  ...tseslint.configs.recommended,

  // 2. 引入 Tailwind CSS 推荐配置
  ...tailwind.configs['flat/recommended'],

  // 3. 引入 Astro 推荐配置
  ...eslintPluginAstro.configs.recommended,

  // 4. 针对 .astro 文件的特殊覆盖
  {
    files: ['**/*.astro'],
    rules: {
      // 允许在 Astro frontmatter 中使用未使用的变量（常见于 props）
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // 5. 全局忽略
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**'],
  },
]
