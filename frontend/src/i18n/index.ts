import { createI18n } from 'vue-i18n';
import zhCN from './locales/zh-CN';
import enUS from './locales/en-US';

// 支持的语言类型
export type Language = 'zh-CN' | 'en-US';

// 默认语言
const DEFAULT_LOCALE: Language = 'zh-CN';

// 支持的语言映射表
const LANGUAGE_MAP: Record<string, Language> = {
  // 中文相关
  zh: 'zh-CN',
  'zh-CN': 'zh-CN',
  'zh-Hans': 'zh-CN',
  'zh-Hans-CN': 'zh-CN',
  'zh-SG': 'zh-CN',
  'zh-MY': 'zh-CN',
  'zh-TW': 'zh-CN', // 繁体中文也映射到简体中文
  'zh-HK': 'zh-CN', // 香港繁体也映射到简体中文
  'zh-Hant': 'zh-CN', // 繁体中文标准代码
  'zh-Hant-TW': 'zh-CN', // 台湾繁体中文
  'zh-Hant-HK': 'zh-CN', // 香港繁体中文
  // 英文相关
  en: 'en-US',
  'en-US': 'en-US',
  'en-GB': 'en-US',
  'en-AU': 'en-US',
  'en-CA': 'en-US',
  'en-NZ': 'en-US',
  'en-ZA': 'en-US',
  'en-IN': 'en-US', // 印度英语
};

// 获取浏览器默认语言
function getDefaultLocale(): Language {
  try {
    // 获取浏览器语言列表
    const languages = navigator.languages || [navigator.language];

    // 遍历浏览器支持的语言，找到第一个匹配的
    for (const lang of languages) {
      // 直接匹配
      if (LANGUAGE_MAP[lang]) {
        return LANGUAGE_MAP[lang];
      }

      // 匹配语言前缀（如 zh-TW -> zh）
      const langPrefix = lang.split('-')[0];
      if (LANGUAGE_MAP[langPrefix]) {
        return LANGUAGE_MAP[langPrefix];
      }
    }
  } catch (error) {
    console.warn('获取浏览器语言失败:', error);
  }

  // 如果没有匹配到任何语言，返回默认语言
  return DEFAULT_LOCALE;
}

// 获取初始语言设置
function getInitialLocale(): Language {
  // 优先使用本地存储的语言设置
  const storedLocale = localStorage.getItem('locale') as Language;
  if (storedLocale && (storedLocale === 'zh-CN' || storedLocale === 'en-US')) {
    return storedLocale;
  }

  // 其次使用浏览器检测的语言
  return getDefaultLocale();
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用组合式API
  locale: getInitialLocale(), // 智能获取初始语言
  fallbackLocale: DEFAULT_LOCALE, // 备用语言（中文）
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
});

// 初始化时设置HTML文档语言
const initialLocale = getInitialLocale();
document.documentElement.lang = initialLocale;

export default i18n;

// 切换语言的工具函数
export function setLocale(locale: Language) {
  // 验证语言是否支持
  if (locale !== 'zh-CN' && locale !== 'en-US') {
    console.warn(`不支持的语言: ${locale}，将使用默认语言: ${DEFAULT_LOCALE}`);
    locale = DEFAULT_LOCALE;
  }

  i18n.global.locale.value = locale;
  localStorage.setItem('locale', locale);

  // 设置HTML文档语言属性
  document.documentElement.lang = locale;

  // 设置页面标题的语言方向（如果需要的话）
  document.documentElement.dir = locale === 'zh-CN' ? 'ltr' : 'ltr'; // 都是从左到右
}

// 获取当前语言
export function getLocale(): Language {
  return i18n.global.locale.value as Language;
}
