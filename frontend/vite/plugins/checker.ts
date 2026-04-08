/**
 * @name ConfigCheckerPlugin
 * @description 在 Vite 中运行 TypeScript 检查
 */
import checker from 'vite-plugin-checker';

export const ConfigCheckerPlugin = () => {
  return checker({
    typescript: true,
    vueTsc: true,
    // 暂时禁用 ESLint 检查，避免版本兼容性问题
    // eslint: {
    //   lintCommand: 'eslint "./src/**/*.{ts,tsx,vue}"',
    //   dev: {
    //     logLevel: ['error', 'warning'],
    //   },
    // },
  });
};
