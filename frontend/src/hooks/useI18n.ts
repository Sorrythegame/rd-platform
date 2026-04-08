import { useI18n as useVueI18n } from 'vue-i18n';
import { setLocale, getLocale, type Language } from '@/i18n';

/**
 * 国际化Hook
 * 提供翻译函数和语言切换功能
 */
export function useI18n() {
  const { t, locale } = useVueI18n();

  /**
   * 切换语言
   * @param lang 语言代码
   */
  const switchLanguage = (lang: Language) => {
    setLocale(lang);
  };

  /**
   * 获取当前语言
   */
  const getCurrentLanguage = () => {
    return getLocale();
  };

  /**
   * 判断是否为中文
   */
  const isZhCN = () => {
    return locale.value === 'zh-CN';
  };

  /**
   * 判断是否为英文
   */
  const isEnUS = () => {
    return locale.value === 'en-US';
  };

  return {
    t, // 翻译函数
    locale, // 当前语言
    switchLanguage, // 切换语言
    getCurrentLanguage, // 获取当前语言
    isZhCN, // 是否为中文
    isEnUS, // 是否为英文
  };
}
