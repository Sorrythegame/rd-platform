// api/product/index.ts
import { get, post, put, del } from '@/utils/request';
import type {
  Product,
  CreateProductParams,
  UpdateProductParams,
  PaginationParams,
  PaginationData,
} from '@/api/types';

// 获取产品列表
export const getProductList = (
  params: PaginationParams & {
    keyword?: string;
    category?: string;
    priceRange?: [number, number];
  },
): Promise<PaginationData<Product>> => {
  return get<PaginationData<Product>>('/product/list', params);
};

// 获取产品详情
export const getProductDetail = (id: number): Promise<Product> => {
  return get<Product>(`/product/${id}`);
};

// 创建产品
export const createProduct = (params: CreateProductParams): Promise<Product> => {
  return post<Product>('/product', params);
};

// 更新产品
export const updateProduct = (params: UpdateProductParams): Promise<Product> => {
  const { id, ...data } = params;
  return put<Product>(`/product/${id}`, data);
};

// 删除产品
export const deleteProduct = (id: number): Promise<null> => {
  return del<null>(`/product/${id}`);
};

// 批量删除产品
export const batchDeleteProducts = (ids: number[]): Promise<null> => {
  return post<null>('/product/batch-delete', { ids });
};

// 获取产品分类列表
export const getProductCategories = (): Promise<string[]> => {
  return get<string[]>('/product/categories');
};

// 产品搜索建议
export const getProductSuggestions = (keyword: string): Promise<string[]> => {
  return get<string[]>('/product/suggestions', { keyword });
};
