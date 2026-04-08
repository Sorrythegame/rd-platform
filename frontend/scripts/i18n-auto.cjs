#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const glob = require('fast-glob');
const config = require('./i18n.config.cjs');
const {
  extractChineseFromFile,
  generateSemanticKey,
  generateHashKey,
} = require('./i18n-extract.cjs');

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bright: '\x1b[1m',
};

function log(message, color = 'reset') {
  if (config.output.colors) {
    console.log(`${colors[color]}${message}${colors.reset}`);
  } else {
    console.log(message);
  }
}

// 创建命令行接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

// 加载现有语言包
function loadExistingLocales() {
  const locales = {};

  for (const lang of config.locales.languages) {
    const filePath = path.join(config.locales.dir, `${lang}.ts`);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const cleanContent = content
          .replace(/import.*from.*['"]/g, '')
          .replace(/export\s+default\s+/, '')
          .replace(/;?\s*$/, '');

        locales[lang] = new Function(`return ${cleanContent}`)();
      } catch (_error) {
        log(`警告: 无法解析语言文件 ${filePath}`, 'yellow');
        locales[lang] = {};
      }
    } else {
      locales[lang] = {};
    }
  }

  return locales;
}

// 扁平化对象
function flattenObject(obj, prefix = '') {
  const flattened = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }

  return flattened;
}

// 设置嵌套对象的值
function setNestedValue(obj, keyPath, value) {
  const keys = keyPath.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

// 格式化输出对象为TypeScript
function formatLocaleFile(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  let result = '';

  if (indent === 0) {
    result += 'export default {\n';
  }

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      result += `${spaces}  // ${key}\n`;
      result += `${spaces}  ${key}: {\n`;
      result += formatLocaleFile(value, indent + 2);
      result += `${spaces}  },\n\n`;
    } else {
      result += `${spaces}  ${key}: '${value}',\n`;
    }
  }

  if (indent === 0) {
    result += '};\n';
  }

  return result;
}

// 保存语言文件
function saveLocaleFiles(locales) {
  for (const [lang, content] of Object.entries(locales)) {
    const filePath = path.join(config.locales.dir, `${lang}.ts`);
    const formattedContent = formatLocaleFile(content);

    // 确保目录存在
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, formattedContent, 'utf-8');
    log(`✅ 已更新语言文件: ${filePath}`, 'green');
  }
}

// 自动替换文件中的中文文本
function autoReplaceFile(filePath, replacements) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // 按行号倒序排列，避免替换时行号变化的问题
  replacements.sort((a, b) => b.line - a.line);

  let replacedCount = 0;

  for (const replacement of replacements) {
    const lineIndex = replacement.line - 1;
    const originalLine = lines[lineIndex];

    // 检查是否需要添加useI18n导入
    const needsImport = !content.includes('useI18n') && !content.includes('$t');

    // 根据文件类型选择替换方式
    let newLine;
    if (filePath.endsWith('.vue')) {
      // Vue文件中使用 $t
      newLine = originalLine.replace(replacement.originalMatch, `$t('${replacement.key}')`);
    } else {
      // TS/JS文件中需要先导入useI18n
      if (needsImport) {
        // 添加导入语句
        const importLine = "import { useI18n } from '@/hooks/useI18n';";
        if (!content.includes(importLine)) {
          // 找到合适的位置插入导入
          const importIndex = lines.findIndex(line => line.startsWith('import'));
          if (importIndex >= 0) {
            lines.splice(importIndex, 0, importLine);
          } else {
            lines.unshift(importLine);
          }
        }
      }
      newLine = originalLine.replace(replacement.originalMatch, `t('${replacement.key}')`);
    }

    lines[lineIndex] = newLine;
    replacedCount++;
  }

  const newContent = lines.join('\n');
  fs.writeFileSync(filePath, newContent, 'utf-8');

  return replacedCount;
}

// 预览替换效果
function previewReplacements(fileReplacements) {
  log('\n📋 替换预览:', 'bright');
  log('═══════════════════════════════════', 'bright');

  for (const [filePath, replacements] of fileReplacements) {
    log(`\n📄 ${filePath} (${replacements.length} 处替换):`, 'blue');

    for (const replacement of replacements) {
      log(`  第${replacement.line}行:`, 'yellow');
      log(`    原文: ${replacement.context}`, 'red');

      const newContext = replacement.context.replace(
        replacement.originalMatch,
        `$t('${replacement.key}')`,
      );
      log(`    替换: ${newContext}`, 'green');
      log('');
    }
  }
}

// 收集替换项
function collectReplacements(files, flattenedLocales) {
  const fileReplacements = new Map();
  const newKeys = new Map();
  let totalReplacements = 0;

  for (const file of files) {
    const chineseTexts = extractChineseFromFile(file);
    if (chineseTexts.length === 0) continue;

    const replacements = [];
    for (const item of chineseTexts) {
      let key;
      const existingKey = Object.keys(flattenedLocales[config.locales.defaultLanguage] || {}).find(
        k => flattenedLocales[config.locales.defaultLanguage][k] === item.text,
      );

      if (existingKey) {
        key = existingKey;
      } else if (newKeys.has(item.text)) {
        key = newKeys.get(item.text);
      } else {
        key =
          config.keyGeneration.strategy === 'semantic'
            ? generateSemanticKey(item.text, item.file)
            : generateHashKey(item.text);

        let uniqueKey = key;
        let counter = 1;
        while (flattenedLocales[config.locales.defaultLanguage]?.[uniqueKey]) {
          uniqueKey = `${key}_${counter}`;
          counter++;
        }
        key = uniqueKey;
        newKeys.set(item.text, key);
      }

      replacements.push({ ...item, key });
      totalReplacements++;
    }
    fileReplacements.set(file, replacements);
  }

  return { fileReplacements, newKeys, totalReplacements };
}

// 执行替换操作
async function performReplacements(fileReplacements, newKeys, locales) {
  if (newKeys.size > 0) {
    log('\n📝 添加新的i18n key到语言包...', 'cyan');
    for (const [text, key] of newKeys) {
      setNestedValue(locales[config.locales.defaultLanguage], key, text);
      for (const lang of config.locales.languages) {
        if (lang !== config.locales.defaultLanguage) {
          setNestedValue(locales[lang], key, `[需要翻译] ${text}`);
        }
      }
    }
    saveLocaleFiles(locales);
  }

  log('\n🔄 开始替换源文件...', 'cyan');
  let totalReplacedCount = 0;
  for (const [filePath, replacements] of fileReplacements) {
    const replacedCount = autoReplaceFile(filePath, replacements);
    totalReplacedCount += replacedCount;
    log(`✅ ${filePath}: 替换了 ${replacedCount} 处中文文本`, 'green');
  }

  log(`\n🎉 自动替换完成！`, 'green');
  log(`📊 总共替换了 ${totalReplacedCount} 处中文文本`, 'green');
  log(`📊 新增了 ${newKeys.size} 个i18n key`, 'green');

  if (newKeys.size > 0) {
    log('\n💡 提示:', 'yellow');
    log('   1. 请检查生成的语言文件内容是否正确', 'yellow');
    log('   2. 请为其他语言添加对应的翻译', 'yellow');
    log('   3. 建议运行 npm run i18n:check 检查是否还有遗漏', 'yellow');
  }
}

// 主函数
async function main() {
  log('🤖 i18n自动替换工具', 'cyan');
  log('─────────────────────────────────────', 'cyan');

  try {
    const files = await glob(config.scanPatterns, { ignore: config.ignorePatterns });
    log(`📁 扫描到 ${files.length} 个文件`, 'blue');

    const locales = loadExistingLocales();
    const flattenedLocales = {};
    for (const [lang, content] of Object.entries(locales)) {
      flattenedLocales[lang] = flattenObject(content);
    }

    const { fileReplacements, newKeys, totalReplacements } = collectReplacements(
      files,
      flattenedLocales,
    );

    if (totalReplacements === 0) {
      log('✅ 没有发现需要替换的中文文本', 'green');
      return;
    }

    log(`📊 发现 ${totalReplacements} 处需要替换的中文文本`, 'blue');
    log(`📊 需要新增 ${newKeys.size} 个i18n key`, 'blue');

    previewReplacements(fileReplacements);

    const confirmReplace = await askQuestion('\n❓ 是否继续执行自动替换？(y/N): ');
    if (confirmReplace.toLowerCase() !== 'y' && confirmReplace.toLowerCase() !== 'yes') {
      log('❌ 用户取消操作', 'yellow');
      return;
    }

    await performReplacements(fileReplacements, newKeys, locales);
  } catch (error) {
    log(`❌ 错误: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    rl.close();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  main,
  autoReplaceFile,
};
