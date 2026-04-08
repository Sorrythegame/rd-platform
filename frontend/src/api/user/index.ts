// api/user/index.ts
import { get, post, put, del } from '@/utils/request';
import type {
  User,
  LoginParams,
  LoginResponse,
  PaginationParams,
  PaginationData,
} from '@/api/types';

// 用户登录
export const login = (params: LoginParams): Promise<LoginResponse> => {
  return post<LoginResponse>('/user/login', params);
};

// 用户注册
export const register = (params: {
  username: string;
  email: string;
  password: string;
}): Promise<User> => {
  return post<User>('/user/register', params);
};

// 获取当前用户信息
export const getCurrentUser = (): Promise<User> => {
  return get<User>('/user/profile');
};

// 更新用户信息
export const updateUser = (params: Partial<User>): Promise<User> => {
  return put<User>('/user/profile', params);
};

// 修改密码
export const changePassword = (params: {
  oldPassword: string;
  newPassword: string;
}): Promise<null> => {
  return post<null>('/user/change-password', params);
};

// 获取用户列表（管理员）
export const getUserList = (
  params: PaginationParams & {
    keyword?: string;
    status?: string;
  },
): Promise<PaginationData<User>> => {
  return get<PaginationData<User>>('/user/list', params);
};

// 删除用户（管理员）
export const deleteUser = (id: number): Promise<null> => {
  return del<null>(`/user/${id}`);
};

// 用户登出
export const logout = (): Promise<null> => {
  return post<null>('/user/logout');
};

// 刷新token
export const refreshToken = (refreshToken: string): Promise<{ token: string }> => {
  return post<{ token: string }>('/user/refresh-token', { refreshToken });
};
