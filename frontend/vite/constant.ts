/**
 * @name Config
 * @description 项目配置
 */

// 应用名
export const APP_TITLE = process.env.VITE_APP_TITLE || 'AI Agent Web';

// 本地服务端口
export const VITE_PORT = Number(process.env.VITE_PORT) || 8000;

// API 配置
export const API_BASE_URL = process.env.VITE_API_BASE_URL || '/templateApi';
export const BASE_TARGET_URL = process.env.VITE_BASE_TARGET_URL || 'http://10.142.144.7:30029';

// 功能开关
export const ANALYSIS = true; // 包依赖分析
export const MARKDOWN = true; // 默认开启
export const COMPRESSION = true; // 默认开启
export const VITE_DROP_CONSOLE = process.env.VITE_DROP_CONSOLE === 'true'; // 删除 console

// 在运行时环境中使用的常量（客户端代码中使用）
export const getClientConfig = () => {
  if (typeof window !== 'undefined') {
    // 浏览器环境
    return {
      APP_TITLE: import.meta.env.VITE_APP_TITLE || 'AI Agent Web',
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/templateApi',
      isDev: import.meta.env.DEV,
      isProd: import.meta.env.PROD,
    };
  }

  // Node.js 环境
  return {
    APP_TITLE: process.env.VITE_APP_TITLE || 'AI Agent Web',
    API_BASE_URL: process.env.VITE_API_BASE_URL || '/templateApi',
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  };
};

// 构建信息（只在浏览器环境中可用）
export const getBuildInfo = () => {
  if (typeof window !== 'undefined') {
    return {
      APP_VERSION: __APP_VERSION__,
      BUILD_TIME: __BUILD_TIME__,
    };
  }
  return {
    APP_VERSION: 'unknown',
    BUILD_TIME: 'unknown',
  };
};
