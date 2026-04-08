#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');

// 配置
const CONFIG = {
  patterns: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.js', '!src/**/*.d.ts'],
  localesDir: 'src/i18n/locales',
  languages: ['zh-CN', 'en-US'],
  chineseRegex: /[\u4e00-\u9fa5]/,
  i18nUsageRegex: /(?:t|i18n\.t|\$t)\s*\(\s*['"`]([^'"`]+)['"`]/g,
};

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
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 加载语言文件
function loadLocales() {
  const locales = {};

  for (const lang of CONFIG.languages) {
    const filePath = path.join(CONFIG.localesDir, `${lang}.ts`);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const cleanContent = content
          .replace(/import.*from.*['"]/g, '')
          .replace(/export\s+default\s+/, '')
          .replace(/;?\s*$/, '');

        const localeData = new Function(`return ${cleanContent}`)();
        locales[lang] = localeData;
      } catch (_error) {
        log(`❌ 读取语言文件失败: ${filePath}`, 'red');
      }
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

// 提取i18n使用
function extractI18nUsage(content) {
  const usedKeys = new Set();
  const matches = [...content.matchAll(CONFIG.i18nUsageRegex)];
  matches.forEach(match => usedKeys.add(match[1]));
  return Array.from(usedKeys);
}

// 提取中文文本
function extractChineseText(content, filePath) {
  const chineseTexts = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    // 跳过注释
    if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
      continue;
    }

    const stringMatches = line.match(/(['"`])[^'"`]*[\u4e00-\u9fa5][^'"`]*\1/g);
    if (stringMatches) {
      stringMatches.forEach(match => {
        const text = match.slice(1, -1);
        if (CONFIG.chineseRegex.test(text)) {
          const beforeMatch = line.substring(0, line.indexOf(match));
          if (!beforeMatch.match(/\$?t\s*\(\s*$/)) {
            chineseTexts.push({
              text,
              file: filePath,
              line: lineNumber,
              context: line.trim(),
            });
          }
        }
      });
    }
  }

  return chineseTexts;
}

// 检查缺失翻译
function checkMissingTranslations(locales, usedKeys) {
  const missing = {};
  const baseLanguage = 'zh-CN';

  if (!locales[baseLanguage]) {
    return missing;
  }

  const baseKeys = flattenObject(locales[baseLanguage]);

  for (const lang of CONFIG.languages) {
    if (lang === baseLanguage) continue;

    missing[lang] = [];

    if (!locales[lang]) {
      missing[lang] = usedKeys;
      continue;
    }

    const langKeys = flattenObject(locales[lang]);

    usedKeys.forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(langKeys, key)) {
        missing[lang].push(key);
      }
    });

    Object.keys(baseKeys).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(langKeys, key) && !missing[lang].includes(key)) {
        missing[lang].push(key);
      }
    });
  }

  return missing;
}

// 主函数
async function main() {
  log('🔍 开始检查i18n国际化...', 'cyan');
  log('─────────────────────────────────────', 'cyan');

  try {
    // 扫描文件
    const files = await glob(CONFIG.patterns);
    log(`📁 扫描到 ${files.length} 个文件`, 'blue');

    // 加载语言包
    const locales = loadLocales();
    log(`🌐 加载语言包: ${Object.keys(locales).join(', ')}`, 'blue');

    // 提取使用的key和中文文本
    const usedKeys = new Set();
    const chineseTexts = [];

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');

      const fileUsedKeys = extractI18nUsage(content);
      fileUsedKeys.forEach(key => usedKeys.add(key));

      const fileChinese = extractChineseText(content, file);
      chineseTexts.push(...fileChinese);
    }

    log(`📊 使用的i18n key: ${usedKeys.size} 个`, 'blue');
    log(`📊 发现未国际化中文: ${chineseTexts.length} 处`, 'blue');

    // 检查缺失翻译
    const missingTranslations = checkMissingTranslations(locales, Array.from(usedKeys));

    // 输出结果
    log('\n📋 检查结果:', 'bright');
    log('═══════════════════════════════════', 'bright');

    let hasMissingTranslations = false;
    for (const [lang, missing] of Object.entries(missingTranslations)) {
      if (missing.length > 0) {
        hasMissingTranslations = true;
        log(`\n❌ ${lang} 缺失翻译 (${missing.length} 项):`, 'red');
        missing.slice(0, 10).forEach(key => {
          log(`   - ${key}`, 'red');
        });
        if (missing.length > 10) {
          log(`   ... 还有 ${missing.length - 10} 项`, 'red');
        }
      }
    }

    if (!hasMissingTranslations) {
      log('\n✅ 所有语言包翻译完整', 'green');
    }

    // 未国际化的中文
    if (chineseTexts.length > 0) {
      log(`\n⚠️  发现未国际化的中文文本 (${chineseTexts.length} 处):`, 'yellow');

      const groupedByFile = {};
      chineseTexts.forEach(item => {
        if (!groupedByFile[item.file]) {
          groupedByFile[item.file] = [];
        }
        groupedByFile[item.file].push(item);
      });

      let displayCount = 0;
      for (const [file, items] of Object.entries(groupedByFile)) {
        if (displayCount >= 5) {
          log(`\n   ... 还有 ${Object.keys(groupedByFile).length - 5} 个文件`, 'yellow');
          break;
        }
        log(`\n   📄 ${file}:`, 'yellow');
        items.slice(0, 3).forEach(item => {
          log(`      第${item.line}行: ${item.text}`, 'yellow');
        });
        if (items.length > 3) {
          log(`      ... 还有 ${items.length - 3} 处`, 'yellow');
        }
        displayCount++;
      }
    } else {
      log('\n✅ 没有发现未国际化的中文文本', 'green');
    }

    // 统计信息
    log('\n📈 统计信息:', 'cyan');
    log('─────────────────────────────────────', 'cyan');
    log(`扫描文件数: ${files.length}`, 'cyan');
    log(`i18n key 使用数: ${usedKeys.size}`, 'cyan');
    log(`未国际化中文: ${chineseTexts.length}`, 'cyan');

    const totalMissing = Object.values(missingTranslations).reduce(
      (sum, arr) => sum + arr.length,
      0,
    );
    log(`缺失翻译总数: ${totalMissing}`, 'cyan');

    const hasIssues = hasMissingTranslations || chineseTexts.length > 0;
    if (hasIssues) {
      log('\n💡 建议运行以下命令修复问题:', 'blue');
      log('   pnpm i18n:extract # 提取中文文本并生成key', 'blue');
      log('   pnpm i18n:auto   # 自动补全翻译', 'blue');
      process.exit(1);
    } else {
      log('\n🎉 i18n检查通过!', 'green');
      process.exit(0);
    }
  } catch (error) {
    log(`❌ 执行失败: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  loadLocales,
  flattenObject,
  extractI18nUsage,
  extractChineseText,
  checkMissingTranslations,
};
