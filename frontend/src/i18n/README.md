# 国际化 (i18n) 使用指南

本项目集成了 Vue I18n 国际化解决方案，支持中英文切换。

## 🌟 功能特性

- ✅ 支持中文 (zh-CN) 和英文 (en-US)
- ✅ **智能语言检测**：自动识别浏览器语言，支持多种语言代码
- ✅ **默认中文显示**：未匹配到支持语言时默认显示中文
- ✅ **繁体中文支持**：自动将繁体中文(zh-TW、zh-HK)映射到简体中文
- ✅ 语言切换持久化存储
- ✅ 与 Ant Design Vue 组件库国际化联动
- ✅ dayjs 时间库国际化联动
- ✅ 提供便捷的 Hook 工具
- ✅ 开发环境测试工具

## 📁 文件结构

```
src/i18n/
├── index.ts           # i18n 配置入口
├── locales/
│   ├── zh-CN.ts      # 中文语言包
│   └── en-US.ts      # 英文语言包
└── README.md         # 使用说明
```

## 🚀 快速开始

### 1. 在组件中使用翻译

```vue
<template>
  <div>
    <h1>{{ t('common.confirm') }}</h1>
    <button>{{ t('common.submit') }}</button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/hooks/useI18n';

const { t } = useI18n();
</script>
```

### 2. 语言切换

```vue
<template>
  <LanguageSwitcher />
</template>

<script setup lang="ts">
import LanguageSwitcher from '@/components/LanguageSwitcher/index.vue';
</script>
```

### 3. 编程式语言切换

```typescript
import { useI18n } from '@/hooks/useI18n';

const { switchLanguage } = useI18n();

// 切换到英文
switchLanguage('en-US');

// 切换到中文
switchLanguage('zh-CN');
```

## 📝 添加新的翻译内容

### 1. 在语言包中添加翻译

**zh-CN.ts**

```typescript
export default {
  // 新增模块
  product: {
    name: '产品名称',
    price: '价格',
    description: '产品描述',
  },
  // ... 其他内容
};
```

**en-US.ts**

```typescript
export default {
  // 新增模块
  product: {
    name: 'Product Name',
    price: 'Price',
    description: 'Product Description',
  },
  // ... 其他内容
};
```

### 2. 在组件中使用

```vue
<template>
  <div>
    <h2>{{ t('product.name') }}</h2>
    <p>{{ t('product.price') }}: $99</p>
    <p>{{ t('product.description') }}</p>
  </div>
</template>
```

## 🛠️ 高级用法

### 1. 带参数的翻译

**语言包**

```typescript
export default {
  welcome: {
    message: '欢迎 {name}，今天是 {date}',
  },
};
```

**组件中使用**

```vue
<template>
  <p>{{ t('welcome.message', { name: '张三', date: '2024-01-01' }) }}</p>
</template>
```

### 2. 复数形式处理

**语言包**

```typescript
export default {
  items: {
    count: '没有项目 | 1个项目 | {count}个项目',
  },
};
```

**组件中使用**

```vue
<template>
  <p>{{ $tc('items.count', itemCount) }}</p>
</template>
```

### 3. 条件渲染

```vue
<template>
  <div>
    <span v-if="isZhCN()">中文内容</span>
    <span v-else>English Content</span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/hooks/useI18n';

const { isZhCN } = useI18n();
</script>
```

## 🔧 Hook API

`useI18n()` Hook 提供以下方法：

| 方法                 | 描述         | 类型                                    |
| -------------------- | ------------ | --------------------------------------- |
| `t`                  | 翻译函数     | `(key: string, params?: any) => string` |
| `locale`             | 当前语言     | `Ref<string>`                           |
| `switchLanguage`     | 切换语言     | `(lang: Language) => void`              |
| `getCurrentLanguage` | 获取当前语言 | `() => Language`                        |
| `isZhCN`             | 是否为中文   | `() => boolean`                         |
| `isEnUS`             | 是否为英文   | `() => boolean`                         |

## 📦 组件

### LanguageSwitcher

语言切换组件，提供下拉菜单形式的语言切换功能。

```vue
<template>
  <LanguageSwitcher />
</template>

<script setup lang="ts">
import LanguageSwitcher from '@/components/LanguageSwitcher/index.vue';
</script>
```

## 🌐 支持的语言

| 语言         | 代码    | 状态      |
| ------------ | ------- | --------- |
| 中文（简体） | `zh-CN` | ✅ 已支持 |
| 英文（美国） | `en-US` | ✅ 已支持 |

## 🔍 演示页面

访问 `/i18n-demo` 路径查看完整的国际化功能演示。

## 🧪 测试工具

在开发环境下，可以在浏览器控制台使用以下命令测试语言检测逻辑：

```javascript
// 测试语言检测功能
runI18nTests();
```

支持的语言检测包括：

- **中文系列**: `zh`, `zh-CN`, `zh-TW`, `zh-HK`, `zh-Hans`, `zh-Hant` 等
- **英文系列**: `en`, `en-US`, `en-GB`, `en-AU`, `en-CA` 等
- **其他语言**: 自动回退到默认中文

## 📋 最佳实践

1. **翻译键命名规范**：使用点分隔的命名空间，如 `module.component.action`
2. **语言包组织**：按功能模块组织翻译内容，保持结构清晰
3. **默认语言**：确保所有翻译键在默认语言包中都有对应的翻译
4. **参数化翻译**：对于动态内容使用参数化翻译而不是字符串拼接
5. **测试**：确保在不同语言下应用功能正常

## 🐛 常见问题

### Q: 如何添加新语言？

1. 在 `locales` 目录下创建新的语言文件
2. 在 `i18n/index.ts` 中导入并配置新语言
3. 更新 `Language` 类型定义
4. 在语言切换组件中添加新语言选项

### Q: 翻译不生效怎么办？

1. 检查翻译键是否正确
2. 确认语言包文件是否正确导入
3. 检查控制台是否有相关错误信息

### Q: 如何处理长文本翻译？

建议将长文本拆分为多个小段落，或使用 `v-html` 指令处理包含 HTML 的翻译内容。
