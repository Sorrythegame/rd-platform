/**
 * ESLint 配置文件 (Flat Config 格式)
 *
 * 这是 ESLint 9.x 版本的新配置格式，采用扁平化配置结构
 * 适用于 Vue 3 + TypeScript + Vite 项目
 *
 * 配置特点：
 * - 支持 JavaScript/TypeScript/Vue 单文件组件
 * - 集成 Prettier 格式化工具
 * - 包含导入语句排序和循环依赖检查
 * - 自动导入 Vue 3 Composition API 全局变量
 */

// === 核心依赖导入 ===
import parserVue from 'vue-eslint-parser'; // Vue 单文件组件解析器

import js from '@eslint/js'; // ESLint 官方 JavaScript 推荐规则集
import pluginTypeScript from '@typescript-eslint/eslint-plugin'; // TypeScript ESLint 规则插件
import parserTypeScript from '@typescript-eslint/parser'; // TypeScript 代码解析器
import configPrettier from 'eslint-config-prettier'; // Prettier 兼容配置，禁用与 Prettier 冲突的规则
import pluginImport from 'eslint-plugin-import'; // 导入语句相关规则插件
import pluginVue from 'eslint-plugin-vue'; // Vue.js 官方 ESLint 插件
import globals from 'globals'; // 全局变量定义库（浏览器、Node.js 等环境变量）

export default [
  // === 基础 JavaScript 规则 ===
  // 应用 ESLint 官方推荐的 JavaScript 规则集
  // 包含语法错误检查、最佳实践等基础规则
  js.configs.recommended,

  // === Vue.js 规则 ===
  // 展开 Vue 官方推荐的所有规则配置
  // 包含模板语法、组件规范、Vue 3 特性等检查
  ...pluginVue.configs['flat/recommended'],

  // === 主要配置对象 ===
  {
    // --- 语言选项配置 ---
    languageOptions: {
      // 全局变量定义
      globals: {
        // 浏览器环境全局变量 (window, document, console 等)
        ...globals.browser,
        // Node.js 环境全局变量 (process, __dirname, Buffer 等)
        ...globals.node,

        // === Vue 3 Composition API 自动导入变量 ===
        // 这些变量通过 unplugin-auto-import 自动导入，无需手动 import
        ref: 'readonly', // 响应式引用
        reactive: 'readonly', // 响应式对象
        computed: 'readonly', // 计算属性
        watch: 'readonly', // 侦听器
        watchEffect: 'readonly', // 副作用侦听器
        onMounted: 'readonly', // 组件挂载钩子
        onUnmounted: 'readonly', // 组件卸载钩子

        // === Vue 3 编译器宏 ===
        // 这些是 Vue 3 组件中可用的编译时宏，无需导入
        defineProps: 'readonly', // 定义组件属性
        defineEmits: 'readonly', // 定义组件事件
        defineExpose: 'readonly', // 暴露组件方法/属性给父组件
        withDefaults: 'readonly', // 为 props 提供默认值
      },

      // 解析器配置
      parser: parserVue, // 使用 Vue 解析器作为主解析器
      parserOptions: {
        parser: parserTypeScript, // Vue 文件中的 <script> 标签使用 TypeScript 解析器
        ecmaVersion: 2021, // 支持 ES2021 语法特性
        sourceType: 'module', // 使用 ES6 模块语法
        extraFileExtensions: ['.vue'], // 额外支持的文件扩展名
      },
    },

    // --- 插件注册 ---
    plugins: {
      '@typescript-eslint': pluginTypeScript, // 注册 TypeScript 插件
      import: pluginImport, // 注册导入语句插件
    },

    // --- 规则配置 ---
    rules: {
      // === Vue.js 相关规则 ===

      // 禁用多词组件名称检查
      // Vue 3 中单词组件名称在某些场景下是可接受的（如 App.vue）
      'vue/multi-word-component-names': 'off',

      // 禁用 v-html 指令警告
      // 在信任的内容环境下，v-html 是安全且必要的
      'vue/no-v-html': 'off',

      // === TypeScript 相关规则 ===

      // 未使用变量检查（TypeScript 版本）
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          // 以下划线开头的参数将被忽略（如 _unused）
          argsIgnorePattern: '^_',
          // 以下划线开头的变量将被忽略
          varsIgnorePattern: '^_',
          // 以下划线开头的捕获错误变量将被忽略
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // 允许使用 any 类型
      // 在某些场景下 any 类型是必要的，特别是与第三方库集成时
      '@typescript-eslint/no-explicit-any': 'off',

      // 允许使用 TypeScript 注释指令
      // 如 @ts-ignore, @ts-expect-error 等
      '@typescript-eslint/ban-ts-comment': 'off',

      // 禁用未使用表达式检查（TypeScript 版本）
      // 避免与某些 Vue 3 响应式特性冲突
      '@typescript-eslint/no-unused-expressions': 'off',

      // 禁用函数类型赋值检查
      // 解决第三方库类型定义不完善导致的类型赋值错误
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',

      // === 通用 JavaScript 规则 ===

      // 禁用原生未使用变量检查，由 TypeScript 版本处理
      'no-unused-vars': 'off',

      // 禁用未定义变量检查，由 TypeScript 类型检查处理
      'no-undef': 'off',

      // 禁用未使用表达式检查，由 TypeScript 版本处理
      'no-unused-expressions': 'off',

      // 要求使用 const 声明不重新赋值的变量
      'prefer-const': 'error',

      // 禁用 var 声明，强制使用 let/const
      'no-var': 'error',

      // === 导入语句相关规则 ===

      // 强制 import 语句必须在文件顶部
      'import/first': 'error',

      // import 语句后必须有空行
      'import/newline-after-import': 'error',

      // 禁止重复导入
      'import/no-duplicates': 'error',
      // 强制导入语句排序
      'import/order': [
        'error',
        {
          // 导入分组顺序：
          groups: [
            'builtin', // Node.js 内置模块 (如 fs, path)
            'external', // npm 包 (如 vue, axios)
            'internal', // 项目内部模块 (通过路径映射配置)
            'parent', // 父级目录 (../something)
            'sibling', // 同级目录 (./something)
            'index', // 当前目录的 index 文件 (./index)
          ],
        },
      ],

      // === 代码复杂度和可维护性规则 ===

      // 限制函数最大行数 (软限制，警告而不是错误)
      'max-lines-per-function': [
        'warn',
        {
          max: 100, // 单个函数最多100行
          skipBlankLines: true, // 跳过空行
          skipComments: true, // 跳过注释行
        },
      ],

      // 限制函数参数数量
      'max-params': [
        'warn',
        {
          max: 5, // 最多5个参数
        },
      ],
    },
  },

  // === Vue 文件专用配置 ===
  {
    // 仅应用于 Vue 单文件组件
    files: ['**/*.vue'],

    rules: {
      // Vue 文件特殊的行数限制 (Vue 文件包含 template/script/style 三部分)
      'max-lines': [
        'warn',
        {
          max: 600, // Vue 文件最多600行
          skipBlankLines: true, // 跳过空行
          skipComments: true, // 跳过注释行
        },
      ],
    },
  },

  // === TypeScript 文件专用配置 ===
  {
    // 仅应用于 TypeScript 文件
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      // 对于纯 TypeScript 文件，直接使用 TypeScript 解析器
      parser: parserTypeScript,
    },

    rules: {
      // 应用 TypeScript 官方推荐规则
      ...pluginTypeScript.configs.recommended.rules,

      // 覆盖特定规则以适应项目需求
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',

      // 未使用变量检查（TypeScript 版本）- 与主配置保持一致
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          // 以下划线开头的参数将被忽略（如 _unused）
          argsIgnorePattern: '^_',
          // 以下划线开头的变量将被忽略
          varsIgnorePattern: '^_',
          // 以下划线开头的捕获错误变量将被忽略
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  // === Prettier 集成配置 ===
  // 必须放在配置数组的最后
  // 这个配置会禁用所有与 Prettier 格式化冲突的 ESLint 规则
  // 确保 ESLint 专注于代码质量，Prettier 专注于代码格式
  configPrettier,
];
