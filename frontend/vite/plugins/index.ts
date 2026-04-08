/**
 * @name createVitePlugins
 * @description 封装plugins数组统一调用
 */
import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import { ConfigSvgIconsPlugin } from './svgIcons';
import { AutoRegistryComponents } from './component';
import { AutoImportDeps } from './autoImport';
import { ConfigVisualizerConfig } from './visualizer';
import { ConfigCompressPlugin } from './compress';
import { ConfigRestartPlugin } from './restart';
import { ConfigProgressPlugin } from './progress';
import { ConfigUnocssPlugin } from './unocss';
import { ConfigCheckerPlugin } from './checker';

export function createVitePlugins(isBuild: boolean) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // Vue 支持
    vue(),
    // JSX 支持
    vueJsx(),
    // Vue DevTools（仅开发环境）
    !isBuild && vueDevTools(),
  ];

  // 自动按需引入组件
  vitePlugins.push(AutoRegistryComponents());

  // 自动按需引入依赖
  vitePlugins.push(AutoImportDeps());

  // UnoCSS 原子化 CSS
  vitePlugins.push(ConfigUnocssPlugin());

  // SVG 图标处理
  vitePlugins.push(ConfigSvgIconsPlugin(isBuild));

  // 类型检查和 ESLint（仅开发环境）
  !isBuild && vitePlugins.push(ConfigCheckerPlugin());

  // 监听配置文件改动重启（仅开发环境）
  !isBuild && vitePlugins.push(ConfigRestartPlugin());

  // 构建时显示进度条
  vitePlugins.push(ConfigProgressPlugin());

  // 开启 Gzip 压缩（仅生产环境）
  isBuild && vitePlugins.push(ConfigCompressPlugin());

  // 打包分析工具（仅生产环境且开启分析）
  isBuild && vitePlugins.push(ConfigVisualizerConfig());

  return vitePlugins.filter(Boolean);
}
