import { ref } from 'vue';
import { message } from 'ant-design-vue';

/**
 * 通用API请求Hook
 * @param options 可选配置
 */
export function useApi<T = any>(options?: {
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}) {
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const execute = async (apiFunction: () => Promise<T>): Promise<T> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await apiFunction();
      data.value = result;

      if (options?.showSuccessMessage) {
        message.success('操作成功');
      }

      if (options?.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (err) {
      const errorObj = err as Error;
      error.value = errorObj;

      if (options?.showErrorMessage !== false) {
        message.error(errorObj.message || '操作失败');
      }

      if (options?.onError) {
        options.onError(err);
      }

      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    error,
    execute,
  };
}

/**
 * 分页数据Hook
 * @param options 分页配置
 */
export function usePagination<T = any>(options?: {
  defaultPageSize?: number;
  showErrorMessage?: boolean;
}) {
  const data = ref<T[]>([]);
  const loading = ref(false);
  const total = ref(0);
  const current = ref(1);
  const pageSize = ref(options?.defaultPageSize || 10);

  const loadData = async (
    apiFunction: (params: any) => Promise<{
      list: T[];
      total: number;
    }>,
    extraParams?: Record<string, any>,
  ) => {
    loading.value = true;
    try {
      const params = {
        page: current.value,
        pageSize: pageSize.value,
        current: current.value,
        size: pageSize.value,
        ...extraParams,
      };

      const result = await apiFunction(params);
      data.value = result.list || [];
      total.value = result.total || 0;

      return result;
    } catch (error) {
      if (options?.showErrorMessage !== false) {
        message.error('加载数据失败');
      }
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const changePage = (page: number, size?: number) => {
    current.value = page;
    if (size) {
      pageSize.value = size;
    }
  };

  const refresh = (apiFunction: any, extraParams?: Record<string, any>) => {
    return loadData(apiFunction, extraParams);
  };

  const reset = () => {
    current.value = 1;
    data.value = [];
    total.value = 0;
  };

  return {
    data,
    loading,
    total,
    current,
    pageSize,
    loadData,
    changePage,
    refresh,
    reset,
  };
}
