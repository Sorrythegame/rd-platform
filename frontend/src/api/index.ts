// 导出类型定义
export * from './types';

// 统一导出所有API模块
export * as userApi from './user';
export * as productApi from './product';

// 也可以按需导出具体的接口
// export { login, register, getCurrentUser, updateUser, getUserList, logout } from './user';
