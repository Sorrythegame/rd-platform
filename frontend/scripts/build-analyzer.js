#!/usr/bin/env node

/**
 * 构建分析工具
 * 用于分析构建产物大小和依赖关系
 */

const { exec } = require('child_process');
const path = require('path');

const commands = [
  // 构建项目
  'pnpm build',
  // 分析构建产物
  'npx vite-bundle-analyzer dist',
];

console.log('🚀 开始构建分析...\n');

async function runCommands() {
  for (const command of commands) {
    console.log(`📦 执行: ${command}`);

    try {
      await new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(`❌ 错误: ${error.message}`);
            reject(error);
            return;
          }
          if (stderr) {
            console.warn(`⚠️  警告: ${stderr}`);
          }
          console.log(stdout);
          resolve();
        });
      });

      console.log(`✅ 完成: ${command}\n`);
    } catch (error) {
      console.error(`❌ 失败: ${command}\n`);
      process.exit(1);
    }
  }

  console.log('🎉 构建分析完成！');
}

runCommands();
