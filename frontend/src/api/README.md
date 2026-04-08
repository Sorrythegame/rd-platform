# API 请求方法使用指南

## 📂 目录结构

```
src/
├── api/
│   ├── index.ts          # 统一导出
│   ├── types.ts         # 类型定义
│   ├── user/index.ts    # 用户相关API
│   └── product/index.ts # 产品相关API
├── utils/
│   └── request.ts       # 基础HTTP方法
└── hooks/
    └── useApi.ts        # API调用Hooks
```

## 🚀 使用方式对比

### 1. 普通API调用（推荐）

**适用场景：** 大部分业务需求、需要精确控制逻辑流程

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { userApi } from '@/api';

const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  try {
    const result = await userApi.login({ username: '', password: '' });
    // 自定义成功处理逻辑
    console.log('登录成功:', result);
  } catch (error) {
    // 自定义错误处理逻辑
    console.error('登录失败:', error);
  } finally {
    loading.value = false;
  }
};
</script>
```

### 2. Hooks调用

**适用场景：** 需要统一回调处理、状态管理复杂

```vue
<script setup lang="ts">
import { useApi } from '@/hooks/useApi';
import { userApi } from '@/api';

const { data, loading, execute } = useApi({
  showSuccessMessage: true,
  onSuccess: data => console.log('成功:', data),
  onError: error => console.log('失败:', error),
});

const handleLogin = () => {
  execute(() => userApi.login({ username: '', password: '' }));
};
</script>
```

## 🎯 选择建议

| 使用场景 | 推荐方式 | 原因                   |
| -------- | -------- | ---------------------- |
| 表单提交 | 普通API  | 需要复杂验证和错误处理 |
| 数据获取 | 普通API  | 业务逻辑清晰，便于调试 |
| 文件上传 | 普通API  | 需要进度控制和错误重试 |
| 简单操作 | Hooks    | 减少重复代码           |
| 统一处理 | Hooks    | 相同的成功/失败逻辑    |

## 错误处理

### 统一错误处理

所有HTTP错误都会在响应拦截器中统一处理：

- `401`: 自动清除token，提示"登录已过期，请重新登录"
- `403`: 提示"没有权限访问"
- `404`: 提示"请求的资源不存在"
- `500`: 提示"服务器内部错误"
- 网络错误: 提示"网络连接失败"或"网络错误，请稍后重试"

### 业务错误处理

后端返回的业务错误通过响应拦截器统一处理：

```typescript
// 当业务状态码不为200时，自动处理错误
if (data.code !== 200) {
  message.error(data.message || '请求失败');
  return Promise.reject(new Error(data.message || '请求失败'));
}
```

## 扩展功能

### 文件上传

```typescript
import { upload } from '@/utils/request';

const formData = new FormData();
formData.append('file', file);

const result = await upload('/upload', formData);
```

### 自定义请求配置

```typescript
import { get, post } from '@/utils/request';

// 自定义超时时间
const data = await get('/api/data', params, { timeout: 30000 });

// 自定义请求头
const result = await post('/api/submit', data, {
  headers: { 'Custom-Header': 'value' },
});
```

### Token自动管理

所有请求都会自动添加Authorization头：

```typescript
// 自动从localStorage获取token并添加到请求头
// Authorization: Bearer {token}
```

## 环境配置

通过环境变量配置API基础URL：

```bash
# .env.development
VITE_API_BASE_URL=/templateApi

# .env.production
VITE_API_BASE_URL=https://your-api-domain.com/templateApi
```

**注意**: 项目默认配置为 `/templateApi`，实际部署时请根据后端服务地址进行配置。

## 注意事项

- 所有API方法都会自动处理响应数据，直接返回`data`字段
- Token会自动添加到请求头中
- 错误会自动显示toast提示
- 建议在业务组件中使用try-catch处理特定的错误逻辑

## ⚡ 快速示例

```typescript
// 基础用法
import { userApi, productApi } from '@/api';

// 登录
await userApi.login({ username: 'user', password: '123' });

// 获取列表
const products = await productApi.getProductList({ page: 1, pageSize: 10 });

// 文件上传
import { upload } from '@/utils/request';
await upload('/upload', formData);
```
