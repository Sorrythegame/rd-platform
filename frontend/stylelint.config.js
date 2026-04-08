export default {
  extends: [
    'stylelint-config-standard', // 基础标准配置
    'stylelint-config-standard-scss', // SCSS 支持
    'stylelint-config-standard-vue', // Vue SFC 支持
    'stylelint-config-recess-order', // CSS 属性排序
    'stylelint-config-prettier', // 与 Prettier 兼容
  ],
  plugins: ['stylelint-scss', 'stylelint-order'],
  overrides: [
    {
      files: ['**/*.(scss|css|vue|html)'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['**/*.(html|vue)'],
      customSyntax: 'postcss-html',
    },
  ],
  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
    '**/*.json',
    '**/*.md',
    '**/*.yaml',
    'node_modules/**',
    'dist/**',
  ],
  /**
   * null  => 关闭该规则
   * always => 必须
   */
  rules: {
    'value-keyword-case': null, // 在 css 中使用 v-bind，不报错
    'no-descending-specificity': null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
    'function-url-quotes': 'always', // 要求 URL 的引号
    'no-empty-source': null, // 关闭禁止空源码
    'selector-class-pattern': null, // 关闭强制选择器类名的格式
    'property-no-unknown': null, // 禁止未知的属性
    'no-invalid-position-at-import-rule': null,

    // 选择器规则
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'v-deep', 'deep'], // 忽略 Vue 深度选择器
      },
    ],

    // At-rule 规则
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer'],
      },
    ],

    // SCSS 相关规则
    'scss/dollar-variable-pattern': null, // 关闭变量命名模式检查
    'scss/at-import-partial-extension': null, // 关闭导入文件扩展名检查

    // 关闭一些严格的格式化规则（让 Prettier 处理）
    'color-hex-length': null,
    'color-function-notation': null,
    'alpha-value-notation': null,
    'hue-degree-notation': null,
    'media-feature-range-notation': null,
    'selector-pseudo-element-colon-notation': null,
    'custom-property-empty-line-before': null,
    'declaration-empty-line-before': null,
    'no-duplicate-selectors': null,
  },
};
