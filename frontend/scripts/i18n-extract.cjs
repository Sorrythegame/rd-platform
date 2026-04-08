#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');
const config = require('./i18n.config.cjs');

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

// 生成语义化key
function generateSemanticKey(text, filePath) {
  // 清理文本
  const cleanText = text
    .trim()
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')
    .substring(0, 20);

  // 根据文件路径推断分类
  let category = 'common';

  if (filePath.includes('login')) {
    category = 'login';
  } else if (filePath.includes('home')) {
    category = 'home';
  } else if (filePath.includes('components')) {
    category = 'component';
  } else if (filePath.includes('views')) {
    category = 'view';
  }

  // 根据文本内容推断分类
  for (const [cat, keywords] of Object.entries(config.keyGeneration.categoryMapping)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      category = cat;
      break;
    }
  }

  // 生成拼音或英文key（简化版，实际项目可以用pinyin库）
  const keyMap = {
    确认: 'confirm',
    取消: 'cancel',
    提交: 'submit',
    保存: 'save',
    删除: 'delete',
    编辑: 'edit',
    添加: 'add',
    搜索: 'search',
    登录: 'login',
    注册: 'register',
    用户名: 'username',
    密码: 'password',
    首页: 'home',
    应用: 'application',
    知识库: 'knowledgeBase',
    模型库: 'modelLibrary',
    成功: 'success',
    失败: 'failed',
    错误: 'error',
    警告: 'warning',
    加载中: 'loading',
    暂无数据: 'noData',
    操作: 'operation',
    返回: 'back',
    重置: 'reset',
  };

  let keyName = keyMap[cleanText] || cleanText.toLowerCase();

  // 如果还是中文，生成hash
  if (config.chineseRegex.test(keyName)) {
    keyName = 'text_' + crypto.createHash('md5').update(text).digest('hex').substring(0, 8);
  }

  return `${category}.${keyName}`;
}

// 生成hash key
function generateHashKey(text) {
  return 'key_' + crypto.createHash('md5').update(text).digest('hex').substring(0, 12);
}

// 提取文件中的中文文本
function extractChineseFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const chineseTexts = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    // 跳过注释行
    if (
      line.trim().startsWith('//') ||
      line.trim().startsWith('/*') ||
      line.trim().startsWith('*')
    ) {
      continue;
    }

    // 跳过已经使用i18n的行
    if (line.match(/\$?t\s*\(/)) {
      continue;
    }

    // 匹配字符串中的中文
    const stringMatches = line.match(/(['"`])[^'"`]*[\u4e00-\u9fa5][^'"`]*\1/g);
    if (stringMatches) {
      stringMatches.forEach(match => {
        const text = match.slice(1, -1).trim();
        if (config.chineseRegex.test(text) && text.length > 0) {
          // 检查是否在排除模式中
          const shouldExclude = config.excludeChinesePatterns.some(pattern => pattern.test(line));

          if (!shouldExclude) {
            chineseTexts.push({
              text,
              file: filePath,
              line: lineNumber,
              context: line.trim(),
              originalMatch: match,
            });
          }
        }
      });
    }
  }

  return chineseTexts;
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

// 扁平化对象，用于检查key是否存在
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

// 生成更新后的源文件内容 (暂时未使用，预留)
function _generateUpdatedFileContent(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // 按行号倒序排列，避免替换时行号变化的问题
  replacements.sort((a, b) => b.line - a.line);

  for (const replacement of replacements) {
    const lines = content.split('\n');
    const line = lines[replacement.line - 1];
    const newLine = line.replace(replacement.originalMatch, `$t('${replacement.key}')`);
    lines[replacement.line - 1] = newLine;
    content = lines.join('\n');
  }

  return content;
}

// 主函数
async function main() {
  log('🚀 开始提取i18n文本...', 'cyan');
  log('─────────────────────────────────────', 'cyan');

  try {
    // 扫描文件
    const files = await glob(config.scanPatterns, {
      ignore: config.ignorePatterns,
    });

    log(`📁 扫描到 ${files.length} 个文件`, 'blue');

    // 加载现有语言包
    const locales = loadExistingLocales();
    const flattenedLocales = {};

    for (const [lang, content] of Object.entries(locales)) {
      flattenedLocales[lang] = flattenObject(content);
    }

    // 提取所有中文文本
    const allChineseTexts = [];
    const newKeys = new Map(); // text -> key
    const fileReplacements = new Map(); // filePath -> replacements[]

    for (const file of files) {
      const chineseTexts = extractChineseFromFile(file);
      allChineseTexts.push(...chineseTexts);

      for (const item of chineseTexts) {
        let key;

        // 检查是否已存在对应的key
        const existingKey = Object.keys(
          flattenedLocales[config.locales.defaultLanguage] || {},
        ).find(k => flattenedLocales[config.locales.defaultLanguage][k] === item.text);

        if (existingKey) {
          key = existingKey;
        } else if (newKeys.has(item.text)) {
          key = newKeys.get(item.text);
        } else {
          // 生成新key
          key =
            config.keyGeneration.strategy === 'semantic'
              ? generateSemanticKey(item.text, item.file)
              : generateHashKey(item.text);

          // 确保key唯一
          let uniqueKey = key;
          let counter = 1;
          while (
            flattenedLocales[config.locales.defaultLanguage] &&
            flattenedLocales[config.locales.defaultLanguage][uniqueKey]
          ) {
            uniqueKey = `${key}_${counter}`;
            counter++;
          }

          key = uniqueKey;
          newKeys.set(item.text, key);
        }

        // 记录替换信息
        if (!fileReplacements.has(item.file)) {
          fileReplacements.set(item.file, []);
        }

        fileReplacements.get(item.file).push({
          ...item,
          key,
        });
      }
    }

    log(`📊 发现中文文本: ${allChineseTexts.length} 处`, 'blue');
    log(`📊 需要新增key: ${newKeys.size} 个`, 'blue');

    if (newKeys.size === 0) {
      log('✅ 没有发现新的中文文本需要国际化', 'green');
      return;
    }

    // 添加新key到语言包
    for (const [text, key] of newKeys) {
      setNestedValue(locales[config.locales.defaultLanguage], key, text);

      // 为其他语言添加占位符或提示
      for (const lang of config.locales.languages) {
        if (lang !== config.locales.defaultLanguage) {
          setNestedValue(locales[lang], key, `[需要翻译] ${text}`);
        }
      }
    }

    // 保存语言文件
    saveLocaleFiles(locales);

    // 询问是否自动替换源文件
    log('\n📝 发现以下需要替换的中文文本:', 'yellow');
    for (const [text, key] of newKeys) {
      log(`  "${text}" -> $t('${key}')`, 'yellow');
    }

    // 这里可以添加交互式确认，简化版本直接输出替换建议
    log('\n💡 建议手动替换源文件中的中文文本为 $t() 调用', 'cyan');
    log('   或者运行 npm run i18n:auto 进行自动替换', 'cyan');

    // 输出详细的替换信息
    if (config.output.verbose) {
      log('\n📋 详细替换信息:', 'bright');
      for (const [filePath, replacements] of fileReplacements) {
        log(`\n📄 ${filePath}:`, 'blue');
        for (const replacement of replacements) {
          log(
            `  第${replacement.line}行: "${replacement.text}" -> $t('${replacement.key}')`,
            'yellow',
          );
        }
      }
    }

    log('\n✅ i18n提取完成！', 'green');
  } catch (error) {
    log(`❌ 错误: ${error.message}`, 'red');
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  main,
  extractChineseFromFile,
  generateSemanticKey,
  generateHashKey,
};
