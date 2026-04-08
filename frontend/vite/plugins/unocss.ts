/**
 * @name ConfigUnocssPlugin
 * @description UnoCSS 原子化 CSS 引擎
 */
import UnoCSS from '@unocss/vite';

export const ConfigUnocssPlugin = () => {
  return UnoCSS({
    // 配置文件路径，如果根目录有 uno.config.ts 会自动读取
  });
};
