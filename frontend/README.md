# 智能体平台管理系统

基于 Vue 3 + TypeScript + Ant Design Vue 构建的现代化智能体平台管理系统，提供完整的智能体应用管理功能。

## 🚀 技术栈

- **Vue 3** - 渐进式 JavaScript 框架，使用 Composition API
- **TypeScript** - 静态类型检查，提升代码质量
- **Vite** - 下一代前端构建工具，快速热更新
- **Ant Design Vue** - 企业级 UI 组件库
- **Vue Router** - 官方路由管理器
- **Pinia** - Vue 3 状态管理
- **UnoCSS** - 原子化 CSS 引擎
- **Sass/SCSS** - CSS 预处理器
- **ESLint + Prettier** - 代码规范和格式化
- **pnpm** - 高效的包管理器

## 📦 快速开始

### 环境要求

- Node.js >= 16
- pnpm >= 8

# 安装依赖

pnpm install

# 启动开发服务器

pnpm dev

# 构建生产版本

pnpm build

# 预览生产构建

pnpm preview

# 构建并分析打包体积

pnpm build:analyze

## 🏗️ 项目结构

```

ai-agent-web/
├── public/ # 静态资源
├── src/
│ ├── api/ # API 接口定义
│ ├── assets/ # 静态资源
│ │ ├── font/ # 字体文件
│ │ ├── icons/ # 图标资源
│ │ └── images/ # 图片资源
│ ├── components/ # 全局组件
│ │ ├── SvgIcon/ # SVG 图标组件
│ │ └── index.ts # 组件注册
│ ├── constants/ # 常量定义
│ ├── hooks/ # 组合式函数
│ ├── layout/ # 布局组件
│ ├── router/ # 路由配置
│ │ ├── index.ts # 路由实例
│ │ ├── routes.ts # 路由定义
│ │ └── permission.ts # 路由守卫
│ ├── store/ # 状态管理
│ │ ├── index.ts # Pinia 实例
│ │ └── modules/ # 状态模块
│ ├── styles/ # 样式文件
│ │ ├── index.scss # 主样式文件
│ │ ├── custom.scss # 自定义样式
│ │ └── variable.scss # 样式变量
│ ├── types/ # 类型定义
│ ├── utils/ # 工具函数
│ ├── views/ # 页面组件
│ │ ├── home/ # 主页面
│ │ │ ├── index.vue # 主布局
│ │ │ ├── app-square/ # 应用广场
│ │ │ ├── model-library/ # 模型库
│ │ │ ├── applications/ # 应用管理
│ │ │ └── knowledge-base/ # 知识库
│ │ └── login/ # 登录页面
│ ├── App.vue # 根组件
│ └── main.ts # 应用入口
├── types/ # 全局类型定义
├── vite/ # Vite 插件配置
├── eslint.config.js # ESLint 配置
├── tsconfig.json # TypeScript 配置
├── uno.config.ts # UnoCSS 配置
└── vite.config.ts # Vite 配置

```

## 🎯 功能特性

### 1. 用户认证

- 完整的 Ant Design Vue 组件库
- 预配置的主题和样式
- 图标库支持

### 2. 样式解决方案

- **UnoCSS** 原子化 CSS 引擎
  - 完全兼容 Tailwind CSS 语法
  - 即时按需生成，零配置启动
  - 高性能，编译时优化
  - 支持属性化模式和图标预设
- **Sass/SCSS** 预处理器
- 响应式设计支持
- 自定义主题变量

### 3. 开发体验

- 热模块替换 (HMR)
- TypeScript 支持
- 代码分割
- 快速构建

### 4. 示例功能

- 响应式布局
- 表单处理
- 数据表格
- 模态框和抽屉
- 消息通知
- 路由准备 (可扩展)

## 🎨 样式系统

### UnoCSS 配置

本项目使用 **UnoCSS** 作为原子化 CSS 引擎，提供了以下特性：

#### UnoCSS vs Tailwind CSS

| 特性         | UnoCSS                       | Tailwind CSS         |
| ------------ | ---------------------------- | -------------------- |
| **性能**     | 编译时按需生成，极快的冷启动 | 运行时 JIT，启动稍慢 |
| **语法兼容** | 100% 兼容 Tailwind 语法      | Tailwind 原生语法    |
| **体积**     | 更小的运行时开销             | 较大的初始包体积     |
| **配置**     | 零配置启动，高度可定制       | 需要配置文件         |
| **预设**     | 丰富的预设生态               | 官方预设             |

#### 使用方式

你可以直接使用 Tailwind CSS 的所有语法：

```html
<!-- 完全兼容 Tailwind CSS 语法 -->
<div
  class="flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg"
>
  内容
</div>

<!-- 属性化模式 (UnoCSS 特有) -->
<div flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg>
  内容
</div>
```

#### 预定义快捷方式

- **全局样式** - `src/styles/index.scss`
- **样式变量** - `src/styles/variable.scss`
- **组件样式** - 使用 `<style scoped lang="scss">`

## 🔧 开发工具

### 代码质量

```bash
# ESLint 检查
pnpm lint:check

# 修复 ESLint 问题
pnpm lint

# Stylelint 检查
pnpm lint:style:check

# 修复样式问题
pnpm lint:style

# Prettier 格式化
pnpm format

# 全量检查
pnpm lint:all
```

### 类型检查

```bash
# TypeScript 类型检查
pnpm type-check
```

### 国际化 (i18n)

项目内置了完整的 i18n 自动化工具，支持自动检测、提取和翻译：

```bash
# 🔍 检查 i18n 完整性
pnpm i18n:check

# 📝 提取中文文本并生成 i18n key
pnpm i18n:extract

# 🤖 自动补全翻译
pnpm i18n:auto

# 🚀 一键同步（推荐）
pnpm i18n:sync

# 📋 完整同步流程
pnpm i18n:sync:full

# ❓ 查看 i18n 工具帮助
pnpm i18n:help
```

**功能特性：**

- ✅ 自动检测未国际化的中文文本
- ✅ 智能生成合理的 i18n key
- ✅ 基于内置词典自动翻译常用词汇
- ✅ 检查缺失翻译和翻译完整性
- ✅ 支持增量更新，不覆盖已有翻译
- ✅ 详细的进度显示和错误报告

详细使用说明请查看：[i18n 工具文档](./scripts/README-i18n.md)

### 构建分析

```bash
# 构建并分析打包体积
pnpm build:analyze

# 生成构建报告
pnpm build:report
```

## 🚀 部署

### 生产构建

```bash
# 构建生产版本
pnpm build

# 构建产物位于 dist/ 目录
```

### 环境配置

项目支持多环境配置，可通过环境变量控制不同环境的行为。

## 📚 开发指南

### 添加新页面

1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/routes.ts` 中添加路由配置
3. 更新左侧菜单配置（如需要）

### 添加新组件

1. 在 `src/components/` 下创建组件
2. 在 `src/components/index.ts` 中注册（如果是全局组件）

### 状态管理

使用 Pinia 进行状态管理，在 `src/store/modules/` 中创建新的状态模块。

### API 接口

在 `src/api/` 中定义 API 接口，使用 TypeScript 进行类型约束。

## 🔗 相关链接

- [Vue 3 文档](https://vuejs.org/)
- [Ant Design Vue](https://antdv.com/)
- [UnoCSS](https://unocss.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
