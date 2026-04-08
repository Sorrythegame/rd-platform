# i18n 国际化脚本工具

本项目提供了一套完整的i18n国际化自动化工具，帮助开发者高效地管理多语言翻译。

## 🚀 快速开始

### 安装依赖

```bash
# 安装必要的依赖
pnpm add fast-glob
```

### 脚本概览

| 脚本           | 功能                       | 使用场景           |
| -------------- | -------------------------- | ------------------ |
| `i18n:check`   | 检查缺失翻译和未国际化文本 | 日常开发检查       |
| `i18n:extract` | 提取中文文本并生成i18n key | 新增功能后批量处理 |
| `i18n:auto`    | 自动替换源码中的中文文本   | 一键国际化         |
| `i18n:sync`    | 同步不同语言包的key        | 保持语言包一致性   |

## 📋 详细说明

### 1. i18n:check - 检查国际化状态

**功能：**

- ✅ 检查缺失的翻译项
- ✅ 发现未国际化的中文文本
- ✅ 验证i18n key的使用情况
- ✅ 生成详细的检查报告

**使用方法：**

```bash
pnpm i18n:check
```

**输出示例：**

```
🔍 开始检查i18n国际化...
📁 扫描到 45 个文件
🌐 加载语言包: zh-CN, en-US
📊 使用的i18n key: 23 个
📊 发现未国际化中文: 8 处

❌ en-US 缺失翻译 (3 项):
  - common.newFeature
  - login.forgotPassword
  - message.uploadSuccess

🔍 发现未国际化的中文文本:
  📄 src/views/home/index.vue:15 -> "欢迎使用"
  📄 src/components/Header.vue:8 -> "设置"
```

### 2. i18n:extract - 提取并生成i18n

**功能：**

- 🔍 智能扫描源码中的中文文本
- 🎯 自动生成语义化的i18n key
- 📝 更新语言包文件
- ⚡ 支持多种key生成策略

**使用方法：**

```bash
pnpm i18n:extract
```

**key生成策略：**

- **语义化策略**：`login.username`, `common.confirm`
- **哈希策略**：`key_a1b2c3d4e5f6`

**配置示例：**

```javascript
// scripts/i18n.config.js
keyGeneration: {
  strategy: 'semantic', // 推荐使用语义化
  autoCategory: true,   // 自动分类
  categoryMapping: {
    'button': ['按钮', '确认', '取消'],
    'message': ['成功', '失败', '错误'],
  }
}
```

### 3. i18n:auto - 自动替换源码

**功能：**

- 🔄 自动替换源码中的中文文本为 `$t()` 调用
- 📁 批量处理多个文件
- 🛡️ 交互式确认，避免误操作
- 📝 自动更新语言包

**使用方法：**

```bash
pnpm i18n:auto
```

**替换示例：**

```javascript
// 替换前
const message = '操作成功';

// 替换后
const message = $t('message.success');
```

**注意事项：**

- 支持 Vue SFC 和 TS/JS 文件
- Vue 文件中使用 `$t()`
- TS/JS 文件中会自动导入 `useI18n`
- 替换前会显示预览，需要用户确认

### 4. i18n:sync - 同步语言包

**功能：**

- 🔄 以默认语言为基准同步其他语言包
- ➕ 添加缺失的翻译key
- ➖ 删除多余的key
- 📊 生成详细的同步报告

**使用方法：**

```bash
pnpm i18n:sync
```

**同步逻辑：**

1. 以 `zh-CN` 为基准语言
2. 为其他语言添加缺失的key（标记为"[需要翻译]"）
3. 删除不存在于基准语言的多余key
4. 保持语言包结构一致

## ⚙️ 配置说明

### 基础配置

```javascript
// scripts/i18n.config.js
module.exports = {
  // 扫描文件范围
  scanPatterns: [
    'src/**/*.vue',
    'src/**/*.ts',
    'src/**/*.js',
    '!src/**/*.d.ts',
  ],

  // 语言配置
  locales: {
    dir: 'src/i18n/locales',
    languages: ['zh-CN', 'en-US'],
    defaultLanguage: 'zh-CN',
  },

  // 排除模式（不需要国际化的场景）
  excludeChinesePatterns: [
    // 注释中的中文
    /\/\/.*[\u4e00-\u9fa5]/,
    // console.log 中的中文
    /console\.(log|warn|error|info)\s*\([^)]*[\u4e00-\u9fa5]/,
  ],
};
```

### 高级配置

```javascript
// 自动翻译配置（未来支持）
translation: {
  enabled: false,
  service: 'google', // google, baidu, youdao
  requireReview: true, // 需要人工审核
},

// 输出配置
output: {
  colors: true,    // 彩色输出
  verbose: false,  // 详细日志
  exportFile: false, // 导出检查报告
}
```

## 🔧 集成到CI/CD

### GitHub Actions 示例

```yaml
name: i18n Check
on: [push, pull_request]

jobs:
  i18n-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: pnpm/action-setup@v2
        with:
          version: latest
      - run: pnpm install --frozen-lockfile
      - run: pnpm i18n:check
```

### Pre-commit Hook

```javascript
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "pnpm i18n:check"
    }
  }
}
```

## 🎯 最佳实践

### 1. 开发流程建议

```bash
# 1. 正常开发，使用中文文本
echo "const title = '用户管理';" >> src/views/user.vue

# 2. 开发完成后，提取i18n
pnpm i18n:extract

# 3. 自动替换源码（可选）
pnpm i18n:auto

# 4. 添加英文翻译
# 编辑 src/i18n/locales/en-US.ts

# 5. 同步语言包
pnpm i18n:sync

# 6. 最终检查
pnpm i18n:check
```

### 2. key命名规范

```javascript
// ✅ 推荐的key结构
{
  common: {
    confirm: '确认',
    cancel: '取消',
  },
  login: {
    title: '登录',
    username: '用户名',
  },
  message: {
    success: '操作成功',
    loginFailed: '登录失败',
  }
}

// ❌ 避免的key结构
{
  text1: '确认',
  userLoginPageTitle: '登录',
  msg_success_operation: '操作成功',
}
```

### 3. 不需要国际化的场景

以下内容会被自动排除，不需要国际化：

- 注释中的中文
- `console.log` 等调试信息
- 配置文件中的描述
- 变量名、函数名
- 第三方库的配置

### 4. Vue组件中的使用

```vue
<template>
  <div>
    <!-- 直接使用 $t -->
    <h1>{{ $t('login.title') }}</h1>
    <button>{{ $t('common.confirm') }}</button>
  </div>
</template>

<script setup lang="ts">
// 在脚本中需要导入
import { useI18n } from '@/hooks/useI18n';

const { t } = useI18n();
const message = t('message.success');
</script>
```

## 🐛 常见问题

### Q: 脚本提示找不到语言文件？

A: 确保 `src/i18n/locales/` 目录存在，且包含对应的语言文件。

### Q: 某些中文没有被检测到？

A: 检查是否被排除模式匹配。可以在配置文件中调整 `excludeChinesePatterns`。

### Q: 自动生成的key不够语义化？

A: 可以在 `i18n.config.js` 中添加更多的 `categoryMapping` 规则。

### Q: 如何处理动态文本？

A: 使用参数化翻译：

```javascript
// 语言包
message: {
  welcome: '欢迎 {name}',
}

// 使用
$t('message.welcome', { name: '张三' })
```

## 📝 更新日志

- **v1.0.0**: 初始版本，支持基础的检查、提取、替换、同步功能
- 计划支持自动翻译API集成
- 计划支持更多文件格式（JSX, TSX等）

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这套工具！

---

💡 **提示**: 建议将 `pnpm i18n:check` 集成到CI/CD流程中，确保代码提交前的国际化质量。
