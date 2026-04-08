# Vite 插件配置说明

本项目使用模块化的插件配置，所有插件都在 `vite/plugins/` 目录下统一管理。

## 🎯 当前已配置的插件

### 核心插件（必需）

- `@vitejs/plugin-vue` - Vue 3 单文件组件支持
- `@vitejs/plugin-vue-jsx` - Vue JSX 语法支持

### 开发工具插件

- `vite-plugin-vue-devtools` - Vue DevTools 集成（仅开发环境）
- `vite-plugin-checker` - TypeScript 和 Vue 类型检查（仅开发环境）
- `vite-plugin-restart` - 监听配置文件变动自动重启（仅开发环境）
- `vite-plugin-progress` - 构建进度条显示

### 自动导入插件

- `unplugin-vue-components` - 组件自动导入
  - 支持 Ant Design Vue 组件
  - 支持 VueUse 组件
  - 自动扫描 `src/components` 目录
- `unplugin-auto-import` - API 自动导入
  - Vue Composition API
  - Pinia 状态管理
  - Vue Router 路由
  - VueUse 工具函数
  - Ant Design Vue 消息组件
  - 自动扫描 `src/composables/**` 和 `src/utils/**` 目录

### 样式和资源插件

- `@unocss/vite` - UnoCSS 原子化 CSS 引擎
- `vite-plugin-svg-icons` - SVG 图标自动导入和处理

### 生产优化插件

- `vite-plugin-compression` - Gzip 压缩（仅生产环境，可通过 `VITE_COMPRESSION` 环境变量控制）
- `rollup-plugin-visualizer` - 打包分析工具（仅生产环境，可通过 `VITE_ANALYSIS` 环境变量控制）

## 📁 插件文件结构

```
vite/plugins/
├── index.ts          # 插件入口文件，统一导出所有插件
├── autoImport.ts     # 自动导入配置
├── component.ts      # 组件自动导入配置
├── checker.ts        # 类型检查配置
├── compress.ts       # Gzip 压缩配置
├── progress.ts       # 构建进度条配置
├── restart.ts        # 配置文件监听重启
├── svgIcons.ts       # SVG 图标处理配置
├── unocss.ts         # UnoCSS 配置
├── visualizer.ts     # 打包分析工具配置
└── README.md         # 本文档
```

## ⚙️ 环境变量控制

项目通过 `vite/constant.ts` 中的环境变量控制部分插件的开启状态：

- `VITE_ANALYSIS` - 控制打包分析工具（默认关闭）
- `VITE_COMPRESSION` - 控制 Gzip 压缩（默认开启）

## 🔧 自动导入配置详情

### API 自动导入 (autoImport.ts)

支持以下库的自动导入：

- **Vue**: Composition API 函数
- **Pinia**: 状态管理相关函数
- **Vue Router**: 路由相关函数
- **VueUse**: 常用工具函数（onClickOutside, useDateFormat, useWebSocket 等）
- **Ant Design Vue**: message, notification, Modal 组件

### 组件自动导入 (component.ts)

- 自动扫描 `src/components` 目录下的 Vue 组件
- 支持 Ant Design Vue 组件自动导入（不引入样式，采用 CSS-in-JS）
- 支持 VueUse 组件自动导入

## 🎨 样式配置

### UnoCSS 集成

- 使用 `@unocss/vite` 插件
- 配置文件：根目录的 `uno.config.ts`

### SVG 图标

- 图标目录：`src/assets/icons`
- 符号 ID 格式：`icon-[dir]-[name]`
- 自定义 DOM ID：`base-svg-dom`

## 🚀 性能优化

### 开发环境

- TypeScript 和 Vue 模板类型检查
- 配置文件变动自动重启
- Vue DevTools 集成

### 生产环境

- Gzip 压缩（阈值 10KB）
- 打包体积分析（可选）
- 删除开发工具代码

## 💡 使用建议

1. **新增自动导入**：在 `autoImport.ts` 中的 `imports` 数组添加需要自动导入的库
2. **禁用某些插件**：修改 `index.ts` 中的条件判断
3. **调整压缩配置**：修改 `compress.ts` 中的压缩参数
4. **自定义组件解析**：在 `component.ts` 中添加新的解析器

## 🔍 调试和分析

- **构建分析**：设置 `VITE_ANALYSIS=true` 启用打包分析
- **类型检查**：开发环境自动启用 TypeScript 检查
- **ESLint 检查**：当前已禁用，避免版本兼容性问题

## 📝 注意事项

1. 所有类型声明文件会自动生成到 `types/` 目录
2. 插件按环境分离，开发和生产环境使用不同配置
3. 部分插件支持环境变量控制，便于灵活配置
4. SVG 图标需要放在指定目录才能被自动处理
