#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
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

// 加载语言文件
function loadLocales() {
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
        log(`❌ 读取语言文件失败: ${filePath}`, 'red');
        locales[lang] = {};
      }
    } else {
      log(`⚠️  语言文件不存在: ${filePath}`, 'yellow');
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

// 反扁平化对象
function unflattenObject(obj) {
  const result = {};

  for (const key in obj) {
    const keys = key.split('.');
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!current[k] || typeof current[k] !== 'object') {
        current[k] = {};
      }
      current = current[k];
    }

    current[keys[keys.length - 1]] = obj[key];
  }

  return result;
}

// 格式化输出对象为TypeScript
function formatLocaleFile(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  let result = '';

  if (indent === 0) {
    result += 'export default {\n';
  }

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
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
function saveLocaleFile(lang, content) {
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

// 同步语言包
function syncLocales(locales) {
  const defaultLang = config.locales.defaultLanguage;
  const defaultLocale = locales[defaultLang] || {};
  const defaultKeys = new Set(Object.keys(flattenObject(defaultLocale)));

  const syncResults = {
    added: {},
    removed: {},
    total: defaultKeys.size,
  };

  // 初始化结果统计
  for (const lang of config.locales.languages) {
    syncResults.added[lang] = [];
    syncResults.removed[lang] = [];
  }

  for (const lang of config.locales.languages) {
    if (lang === defaultLang) continue;

    const locale = locales[lang] || {};
    const flatLocale = flattenObject(locale);
    const currentKeys = new Set(Object.keys(flatLocale));

    // 找出缺失的key（需要添加）
    const missingKeys = new Set([...defaultKeys].filter(key => !currentKeys.has(key)));

    // 找出多余的key（需要删除）
    const extraKeys = new Set([...currentKeys].filter(key => !defaultKeys.has(key)));

    // 添加缺失的key
    const flatDefaultLocale = flattenObject(defaultLocale);
    for (const key of missingKeys) {
      const defaultValue = flatDefaultLocale[key];
      flatLocale[key] = `[需要翻译] ${defaultValue}`;
      syncResults.added[lang].push(key);
    }

    // 删除多余的key
    for (const key of extraKeys) {
      delete flatLocale[key];
      syncResults.removed[lang].push(key);
    }

    // 重新构建嵌套对象
    locales[lang] = unflattenObject(flatLocale);
  }

  return syncResults;
}

// 主函数
async function main() {
  log('🔄 开始同步i18n语言包...', 'cyan');
  log('─────────────────────────────────────', 'cyan');

  try {
    // 加载所有语言包
    const locales = loadLocales();
    log(`🌐 加载语言包: ${Object.keys(locales).join(', ')}`, 'blue');

    const defaultLang = config.locales.defaultLanguage;
    if (!locales[defaultLang] || Object.keys(locales[defaultLang]).length === 0) {
      log(`❌ 默认语言包 ${defaultLang} 为空或不存在`, 'red');
      return;
    }

    // 同步语言包
    const syncResults = syncLocales(locales);

    // 保存更新后的语言包
    for (const lang of config.locales.languages) {
      if (lang !== defaultLang) {
        saveLocaleFile(lang, locales[lang]);
      }
    }

    // 输出同步结果
    log('\n📊 同步结果:', 'bright');
    log('═══════════════════════════════════', 'bright');

    log(`📋 基准语言: ${defaultLang} (${syncResults.total} 个key)`, 'blue');

    let hasChanges = false;

    for (const lang of config.locales.languages) {
      if (lang === defaultLang) continue;

      const added = syncResults.added[lang];
      const removed = syncResults.removed[lang];

      if (added.length > 0 || removed.length > 0) {
        hasChanges = true;
        log(`\n🔄 ${lang}:`, 'yellow');

        if (added.length > 0) {
          log(`  ➕ 新增 ${added.length} 个key:`, 'green');
          added.forEach(key => log(`    + ${key}`, 'green'));
        }

        if (removed.length > 0) {
          log(`  ➖ 删除 ${removed.length} 个key:`, 'red');
          removed.forEach(key => log(`    - ${key}`, 'red'));
        }
      } else {
        log(`\n✅ ${lang}: 已同步`, 'green');
      }
    }

    if (!hasChanges) {
      log('\n✅ 所有语言包已同步，无需更新', 'green');
    } else {
      log('\n🎉 语言包同步完成！', 'green');
      log('\n💡 提示:', 'yellow');
      log('   1. 请检查新增的翻译项并提供正确的翻译', 'yellow');
      log('   2. 标记为 "[需要翻译]" 的项目需要人工翻译', 'yellow');
      log('   3. 建议运行 npm run i18n:check 验证同步结果', 'yellow');
    }
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
  syncLocales,
  loadLocales,
};
